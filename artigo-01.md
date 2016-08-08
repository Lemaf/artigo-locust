# Locust.io e a primeira onda!

Já imaginou um belo dia por alguma razão inesperada ou esperada milhares de pessoas resolverem acessar o seu site? Como se preparar?

Para ajudar a se preparar vamos aprender um pouco sobre uma grande e simples ferramenta para realizar os testes de carga, o [**Locust**](http://locust.io).

Pretendo escrever sobre o locust em 4 artigos:

1. A primeira onda: Vamos conhecer um pouco do Locust e fazer nosso primeiro teste.
2. Atacando com várias ondas: Veremos como executar um teste distribuído em várias máquinas.
3. Usando o Python: Usaremos a artilharia do Python para realizar testes mais elaborados.
4. Modificando genéticamente nossos gafanhotos: Será a hora de adicionarmos novos recursos aos nossos testes.

Agora vamos para a primeira parte da série!

# A primeira onda: Introdução

Executar uma simulação de centenas ou milhares de usuários por si só já é um problema considerável, existem várias ferramentas mas o diferencial do Locust é que ele torna a tarefa muito simples. A primeira característica é como você deve escrever as simulações, o Locust usa como linguagem o Python, então tudo o que você precisará fazer é programar em Python!

A segunda característica que torna o Locust interessante é a forma como ele [simula centenas ou milhares de usuários](http://docs.locust.io/en/latest/what-is-locust.html), por exemplo, diferentemente do [JMeter](http://jmeter.apache.org) que usa uma *thread* para cada usuário o Locust é um [sistema de eventos](http://www.gevent.org) baseados em [*micro-threads*](https://greenlet.readthedocs.io/en/latest/), ou seja, você tem *pequenas threads* compartilhando tempo de processamento de uma ou poucas *threads* do sistema operacional. Essa característica permite ao Locust executar centenas de testes concorrentemente!

## Python

Se você como eu não está habituado a programar em Python recomedo o ótimo [Python para Desenvolvedores](http://ricardoduarte.github.io/python-para-desenvolvedores/), lá você poderá aprender rapidamente a dar seus primeiros passos em Python e se você quiser mais informações também recomendo a [documentação oficial](https://docs.python.org/2.7/index.html).

# Os primeiros passos

Okay! Um pouco de pragmatismo não faz mal a ninguém, então vamos começar a diversão!

## Instalação

Você precisará do Python 2.7 instalado em seu sistema para iniciar.

### Linux e \*nix

Python já vem instalado em praticamente todas as distribuições Linux, mas caso você seja uma pessoa exótica ou goste de distribuições exóticas dê uma olhada aqui [Using Python on Unix platforms](https://docs.python.org/2.7/using/unix.html#on-linux).

### Mac OS

Agora se você é fã da maçã o Python também já está lá, mas caso queira mais alguns detalhes aqui vai um link [Using Python on a Macintosh](https://docs.python.org/2.7/using/mac.html).

### Microsoft Windows®

Se você é um desenvolvedor windows aí será necessário instalar o Python [Using Python on Windows](https://docs.python.org/2.7/using/windows.html).

### Instalado o Locust

O jeito mais fácil de instalar o Locust é através do [PyPi](https://pypi.python.org/pypi). Então você apenas precisará executar isso no seu terminal:

> pip install locustio

Caso você se depare com alguma mensagem de comando não encontrado você pode ver [aqui](https://pip.pypa.io/en/latest/installing/) algumas dicas de como instalar o pip.

#### Algumas observações

No [*Arch Linux*](https://www.archlinux.org) o comando para instalar o Locust é **pip2**. A razão disso é que nessa distribuição tanto o Python 3 e Python 2.7 já estão instalados então é comum que os comandos relacionados ao python por default façam referência a versão 3, nesse caso sempre há versões dos comandos específicas para o Python 2.7, então aqui precisei instalar da seguinte forma:

> pip2 install locustio

Outra observação é que no *Arch Linux* o pip2 tenta instalar o locust como um comando de sistema, ou seja, ele precisará de poderes de *root* e nesse caso foi necessário usar o **sudo**:

> sudo pip2 install locustio

Se você tiver algum problema talvez no seu sistema a solução seja a mesma que usei para instalar no meu sistema.

## Uma vez instalado...

Agora que você já tem o Locust instalado é hora de iniciar a simulação ou o ataque, a diferença pode ser bem sutil. O Locust é instalado como um comando então você a princípio precisará apenas digitar:

> locust -f <locustfile>

## O locustfile

O locustfile é um arquivo com o código python do seu teste. A única exigência é que o arquivo tenha uma classe Locust e essa classe representará um usuário, ou um gafanhoto. Para explicar como fazer um teste acredito que a melhor maneira seja fazendo um teste, então vamos para o consegrado Hello World!

Nessa série usarei o [Node.js](https://nodejs.org) para escrever as aplicações que serão testadas, os códigos fonte podem ser acessados no nosso [repositório](https://github.com/Lemaf/artigo-locust/tree/artigo-1) no github.

A primeira aplicação (o código fonte está [aqui](https://github.com/Lemaf/artigo-locust/blob/artigo-1/hello_world.js)) que será testada é um servidor HTTP que responderá a requisições GET com a uma *string* `Hello <nome>`, no caso `<nome>` é um parâmetro enviado na *query string* da *URL*.

Então uma requisição como:

> GET /qualquercoisa?nome=World

Deverá ser respondida com um:

> Hello World!

Como testar? A seguir um exemplo de teste.

```python
from locust import HttpLocust, TaskSet, task
import random

class PrimeiroTeste(TaskSet):
    @task
    def test_01(self):
        nome = random.choice(('Einstein', 'Newton', 'Maxwell', 'Faraday'))
        with self.client.get('/', catch_response = True, params = {'nome': nome}) as response:
            if response.text == ('Hello %s!' % nome):
                response.success()
            else:
                response.failure('Resposta inesperada!')

class HelloWorld(HttpLocust):
    task_set = PrimeiroTeste
    min_wait=50
    max_wait=1000

```

### Entendo o código...

Como testar no Locust basicamente é programar em python algumas bibliotecas serão necessárias. O primeiro *import* é fundamental, veja que importei as classes **HtppLocust** e **TaskSet** e o [decorator](http://nbviewer.jupyter.org/github/ricardoduarte/python-para-desenvolvedores/blob/master/Capitulo17/Capitulo17_Decoradores.ipynb) **task**.

Vejamos o que importamos:

* **HttpLocust** É a classe base dos nossos testes.
* **TaskSet** Como o próprio nome diz é o conjunto de tarefas.
* **tasks** É um *decorator*, de forma muito simples um decorator é uma função que altera outras funções, podemos dizer que o seu teste é *decorado* por outra função.

#### *HttpLocust*

Todo arquivo locust deve ter uma classe que seja herdeira da **HttpLocust**, isso para testes *HTTP* mas isso é uma conversa para outro momento na série. Nessa classe você precisa definir um conjunto de tarefas que serão executadas e isso é feito através do atributo *task_set* onde é definido que o conjunto de tarefas é a classe *PrimeiroTeste*.
