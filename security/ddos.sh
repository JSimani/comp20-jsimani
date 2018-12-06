
#!/bin/bash
# Basic while loop
counter=1
while [ $counter -le 1000000 ]
do
echo $counter
curl -d "username=Josh&score=12346&grid={}" https://secret-oasis-38538.herokuapp.com/submit > /dev/null 2> /dev/null
((counter++))
done
echo All done
