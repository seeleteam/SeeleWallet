git clone https://github.com/seeleteam/go-seele-binaries.git
cp go-seele-binaries/linux/build/client linux/client
cp go-seele-binaries/linux/build/node linux/node
cp go-seele-binaries/mac/build/client mac/client
cp go-seele-binaries/mac/build/node mac/node
cp go-seele-binaries/win32/build/client.exe win32/client.exe
cp go-seele-binaries/win32/build/node.exe win32/node.exe
rm -rf go-seele-binaries
echo "Version is: " $(./mac/node -v)