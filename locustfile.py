from locust import HttpLocust, TaskSet, task
import random

class PrimeiroTeste(TaskSet):
    @task
    def test_01(self):
        nome = random.choice(('Einstein', 'Newton', 'Maxwell', 'Faraday'))
        with self.client.get('/', catch_response = True, params = {'nome': nome}) as response:
            if response.text == ('Hello, %s!' % nome):
                response.success()
            else:
                response.failure('Resposta inesperada!')

class HelloWorld(HttpLocust):
    task_set = PrimeiroTeste
    min_wait=50
    max_wait=1000
