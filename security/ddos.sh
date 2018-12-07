
#!/bin/bash
# Basic while loop
counter=1
while [ $counter -le 1000000 ]
do
echo $counter
curl -d --max-time 0.1 "username=Josh&score=12346&grid={}" https://cryptic-brook-57226.herokuapp.com/submit > /dev/null 2> /dev/null
((counter++))
done
echo All done
