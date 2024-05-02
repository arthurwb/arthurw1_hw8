@echo off

node src/index.js password.enc.txt sm.cho@hello.com 123456
echo "expect true"
node src/index.js password.enc.txt john.deacon@good.com bestpassword
echo "expect true"
node src/index.js password.enc.txt alan.may@best.com mypassword
echo "expect true"
node src/index.js password.enc.txt henry.taylor@edu.com educatorbest
echo "expect true"

node src/index.js password.enc.txt sm.cho@hello.com 1234567
echo "expect false"
node src/index.js password.enc.txt henry.taylor@edu.com educatorbests
echo "expect false"
node src/index.js password.enc.txt noname@hello.come 1234
echo "expect false"
node src/index.js password.enc.txt alan.may@best.com
echo "expect 'Please provide both email and password.'"

pause