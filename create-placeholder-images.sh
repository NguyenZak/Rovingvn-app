# Script để tạo placeholder images cho Logo và Favicon
# Chạy script này để tạo các file image tạm thời

# Tạo thư mục images nếu chưa có
mkdir -p public/images

# Hướng dẫn tạo placeholder images:
echo "======================================"
echo "HƯỚNG DẪN TẠO LOGO VÀ FAVICON"
echo "======================================"
echo ""
echo "Cách 1: Sử dụng online tool (Khuyến nghị)"
echo "1. Logo Generator: https://www.canva.com/create/logos/"
echo "2. Favicon Generator: https://realfavicongenerator.net/"
echo ""
echo "Cách 2: Sử dụng ImageMagick (Command line)"
echo ""
echo "Cài đặt ImageMagick:"
echo "  brew install imagemagick  # MacOS"
echo "  sudo apt install imagemagick  # Ubuntu/Debian"
echo ""
echo "Tạo placeholder logo từ text:"
echo '  convert -size 300x100 xc:white -font Arial-Bold -pointsize 40 \'
echo '    -fill "#10b981" -gravity center -annotate +0+0 "RovingVN" \'
echo '    public/images/logo.png'
echo ""
echo "Tạo logo dark mode:"
echo '  convert -size 300x100 xc:transparent -font Arial-Bold -pointsize 40 \'
echo '    -fill "white" -gravity center -annotate +0+0 "RovingVN" \'
echo '    public/images/logo-dark.png'
echo ""
echo "Tạo logo nhỏ:"
echo '  convert -size 100x100 xc:white -font Arial-Bold -pointsize 30 \'
echo '    -fill "#10b981" -gravity center -annotate +0+0 "RV" \'
echo '    public/images/logo-small.png'
echo ""
echo "Tạo favicon 16x16:"
echo '  convert -size 16x16 xc:white -font Arial-Bold -pointsize 12 \'
echo '    -fill "#10b981" -gravity center -annotate +0+0 "R" \'
echo '    public/favicon-16x16.png'
echo ""
echo "Tạo favicon 32x32:"
echo '  convert -size 32x32 xc:white -font Arial-Bold -pointsize 24 \'
echo '    -fill "#10b981" -gravity center -annotate +0+0 "R" \'
echo '    public/favicon-32x32.png'
echo ""
echo "Tạo Apple Touch Icon:"
echo '  convert -size 180x180 xc:white -font Arial-Bold -pointsize 60 \'
echo '    -fill "#10b981" -gravity center -annotate +0+0 "RV" \'
echo '    public/apple-touch-icon.png'
echo ""
echo "Tạo Android Chrome Icons:"
echo '  convert -size 192x192 xc:white -font Arial-Bold -pointsize 80 \'
echo '    -fill "#10b981" -gravity center -annotate +0+0 "RV" \'
echo '    public/android-chrome-192x192.png'
echo '  convert -size 512x512 xc:white -font Arial-Bold -pointsize 200 \'
echo '    -fill "#10b981" -gravity center -annotate +0+0 "RV" \'
echo '    public/android-chrome-512x512.png'
echo ""
echo "Tạo OG Image (Open Graph):"
echo '  convert -size 1200x630 xc:"#10b981" -font Arial-Bold -pointsize 80 \'
echo '    -fill "white" -gravity center -annotate +0+0 "Roving Việt Nam\nDu lịch Việt Nam" \'
echo '    public/images/og-image.jpg'
echo ""
echo "Convert PNG sang ICO:"
echo '  convert public/favicon-32x32.png public/favicon-16x16.png \'
echo '    -colors 256 public/favicon.ico'
echo ""
echo "======================================"
echo "Sau khi tạo xong, kiểm tra các file trong:"
echo "  - public/images/"
echo "  - public/"
echo "======================================"
