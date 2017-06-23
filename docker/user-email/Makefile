container :
	cp ../../user/user-email/user-email-service.js .
	cp ../../user/user-email/user-email.js .	
	
	sudo docker build -t user-email .
	sudo docker images | grep user-email

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name user-email -e HOST=@eth0 -e BASES=base0:39000,base1:39001 user-email

rm-single :
	sudo docker service rm user-email

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean