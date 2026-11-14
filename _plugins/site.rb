# Site plugin. Runs on GitHub Actions and locally (not on GitHub's built-in
# Pages builder, which doesn't allow custom plugins).
require "fastimage"
require "uri"

module Rigas
  # ---------------------------------------------------------------------------
  # One page per project per language: /en/portfolio/<slug>/, /el/portfolio/<slug>/
  # The content comes from _projects/<slug>.md, which holds both languages.
  # ---------------------------------------------------------------------------
  class ProjectPages < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      site.collections["projects"].docs.each do |doc|
        slug = doc.data["slug"]
        site.config["languages"].each do |lang|
          page = Jekyll::PageWithoutAFile.new(site, site.source, "#{lang}/portfolio/#{slug}", "index.html")
          title = doc.data["title_#{lang}"].to_s.empty? ? doc.data["title_en"] : doc.data["title_#{lang}"]
          page.data.merge!(
            "layout" => "project",
            "lang" => lang,
            "ref" => "project:#{slug}",
            "title" => title,
            "project" => doc.data
          )
          site.pages << page
        end
      end
    end
  end

  # ---------------------------------------------------------------------------
  # Pixel sizes of local images and MP4 videos, so the browser can reserve
  # their space before they load (no jumping while the page fills in).
  # ---------------------------------------------------------------------------
  module MediaSize
    @cache = {}

    def self.of(site, src)
      return nil if src.nil? || src.empty? || src =~ %r{\A[a-z]+://}i
      path = File.join(site.source, URI.decode_www_form_component(src.sub(%r{\A/}, "")).tr("+", " "))
      path = File.join(site.source, src.sub(%r{\A/}, "")) unless File.file?(path)
      return nil unless File.file?(path)
      @cache[path] ||= begin
        if path =~ /\.(mp4|m4v|mov)\z/i
          mp4(path)
        else
          FastImage.size(path)
        end
      end
    end

    # Reads width/height from the MP4 track header ('tkhd' box), swapping
    # them for phone videos recorded rotated by 90/270 degrees.
    def self.mp4(path)
      File.open(path, "rb") do |f|
        find = lambda do |start, stop, want|
          pos = start
          while pos + 8 <= stop
            f.seek(pos)
            len, type = f.read(8).unpack("Na4")
            head = 8
            if len == 1
              len = f.read(8).unpack1("Q>")
              head = 16
            elsif len.zero?
              len = stop - pos
            end
            break if len < head
            return [pos + head, pos + len] if type == want
            pos += len
          end
          nil
        end

        moov = find.call(0, f.size, "moov") or return nil
        pos = moov[0]
        while (trak = find.call(pos, moov[1], "trak"))
          if (tkhd = find.call(trak[0], trak[1], "tkhd"))
            f.seek(tkhd[0])
            version = f.read(1).unpack1("C")
            f.seek(tkhd[0] + (version == 1 ? 36 : 24) + 8 + 8)
            matrix = f.read(36).unpack("l>9")
            w, h = f.read(8).unpack("N2").map { |v| (v / 65536.0).round }
            if w.positive? && h.positive?
              w, h = h, w if matrix[0].zero? && !matrix[1].zero?
              return [w, h]
            end
          end
          pos = trak[1]
        end
        nil
      end
    rescue StandardError
      nil
    end
  end

  module Filters
    # {{ "/images/a.jpg" | media_size_attrs }} -> width="1920" height="1080"
    def media_size_attrs(src)
      size = MediaSize.of(@context.registers[:site], src.to_s)
      size ? %(width="#{size[0]}" height="#{size[1]}") : ""
    end

    # {{ block | tr: "text", page.lang }} -> block.text_el, or block.text_en when
    # the Greek field doesn't exist at all. A field left deliberately empty stays empty.
    def tr(obj, field, lang)
      return "" unless obj.respond_to?(:[])
      value = obj["#{field}_#{lang}"]
      value = obj["#{field}_en"] if value.nil?
      value.nil? ? "" : value.to_s
    end
  end
end

Liquid::Template.register_filter(Rigas::Filters)
