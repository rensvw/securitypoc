container :
	cp ../../user/user-sms/user-sms-service.js .
	cp ../../user/user-sms/user-sms.js .	
	
	sudo docker build -t user-sms .
	sudo docker images | grep user-sms

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name user-sms -e HOST=@eth0 -e BASES=base0:39000,base1:39001 user-sms

rm-single :
	sudo docker service rm user-sms

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean