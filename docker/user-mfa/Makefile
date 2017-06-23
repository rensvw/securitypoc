container :
	cp ../../user/user-mfa/user-mfa-service.js .
	cp ../../user/user-mfa/user-mfa.js .	
	
	sudo docker build -t user-mfa .
	sudo docker images | grep user-mfa

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name user-mfa -e HOST=@eth0 -e BASES=base0:39000,base1:39001 user-mfa

rm-single :
	sudo docker service rm user-mfa

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean