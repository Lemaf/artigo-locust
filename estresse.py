from locust import HttpLocust, TaskSet, task
from random import choice

class Calculo(TaskSet):
	@task
	def test_01(self):

		tupla = choice(((50,5), (5e2, 5), (5e3,5), (5e4, 5), (5e5, 5)))

		with self.client.get('/combinacao', catch_response = True, params = {'n': tupla[0], 'r': tupla[1]}) as response:
			if response.text.startswith('Ok: '):
				response.success()
			else:
				response.failure('Resposta inesperada!')

class Usuario(HttpLocust):
	task_set = Calculo
	min_wait=50
	max_wait=1000
