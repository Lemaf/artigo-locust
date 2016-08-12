from locust import HttpLocust, TaskSet, task
from random import choice

class Calculo(TaskSet):
    @task
    def test_01(self):
        numero = choice((1e2, 5e2, 1e3, 5e3, 1e4, 5e4, 1e5))
        with self.client.get('/', catch_response = True, params = {'numero': numero}) as response:
            if response.text == ('Foram processados %d dados!' % numero):
                response.success()
            else:
                response.failure('Resposta inesperada!')

class Usuario(HttpLocust):
    task_set = Calculo
    min_wait=50
    max_wait=1000
