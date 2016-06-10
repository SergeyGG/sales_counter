from wsgiref.simple_server import make_server

from pyramid.config import Configurator

if __name__ == '__main__':
    config = Configurator()

    config.include('pyramid_mongoengine')
    config.include('pyramid_chameleon')

    config.add_connection_database()

    config.add_static_view('public', 'public')

    config.add_route('index', '/')
    config.add_route('sales', '/sales')
    config.add_route('add_sale', '/sales/add')
    config.add_route('get_sale', '/sales/{uid}')
    config.add_route('edit_sale', '/sales/edit/{uid}')
    config.add_route('remove_sale', '/sales/delete/{uid}')

    config.scan('views')

    app = config.make_wsgi_app()
    server = make_server('0.0.0.0', 8080, app)
    server.serve_forever()
