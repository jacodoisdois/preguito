#!/bin/bash
set -euo pipefail

VERSION=$(node -e "import('./package.json', { with: { type: 'json' } }).then(m => console.log(m.default.version))")
PKG_NAME="preguito"
ARCH="amd64"
BUILD_DIR="build/deb-staging"
DEB_ROOT="${BUILD_DIR}/${PKG_NAME}_${VERSION}_${ARCH}"

echo "Building .deb package for ${PKG_NAME} v${VERSION}..."

# Create Debian package directory structure
rm -rf "${DEB_ROOT}"
mkdir -p "${DEB_ROOT}/DEBIAN"
mkdir -p "${DEB_ROOT}/usr/bin"
mkdir -p "${DEB_ROOT}/usr/share/doc/${PKG_NAME}"

# Copy binary
cp build/guito "${DEB_ROOT}/usr/bin/guito"
chmod 755 "${DEB_ROOT}/usr/bin/guito"

# Copy Debian control files
cp debian/control "${DEB_ROOT}/DEBIAN/control"
sed -i "s/^Version:.*/Version: ${VERSION}/" "${DEB_ROOT}/DEBIAN/control"

# Copy documentation
cp debian/copyright "${DEB_ROOT}/usr/share/doc/${PKG_NAME}/copyright"
cp debian/changelog "${DEB_ROOT}/usr/share/doc/${PKG_NAME}/changelog"
gzip -n -9 "${DEB_ROOT}/usr/share/doc/${PKG_NAME}/changelog"

# Build the .deb
fakeroot dpkg-deb --build "${DEB_ROOT}"

# Move to build directory root
mv "${BUILD_DIR}/${PKG_NAME}_${VERSION}_${ARCH}.deb" "build/"

echo ""
echo "Package built: build/${PKG_NAME}_${VERSION}_${ARCH}.deb"
echo "Install with: sudo dpkg -i build/${PKG_NAME}_${VERSION}_${ARCH}.deb"
