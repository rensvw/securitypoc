container :
	cp ../../auth/auth-mfa/auth-mfa.js .
	cp ../../auth/auth-mfa/auth-mfa-service.js .
	
	sudo docker build -t auth-mfa .
	sudo docker images | grep auth-mfa

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name auth-mfa -e HOST=@eth0 -e BASES=base0:39000,base1:39001 auth-mfa

rm-single :
	sudo docker service rm auth-mfa

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean