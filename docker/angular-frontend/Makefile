container :
	cp -r ../../angular-frontend/dist .
	docker build -t angular-frontend .
	docker images | grep angular-frontend

run-single :
	docker service create --replicas 1 --network securitypoc --publish 80:80 --name angular-frontend

rm-single :
	docker service rm angular-frontend

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean