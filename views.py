from pyramid.view import view_config

from models import Sale


@view_config(route_name='index', renderer='templates/index.pt')
def index(request):
    return {}


@view_config(route_name='sales', renderer='json')
def get_sales(request):
    sales = Sale.objects
    return {'sales': sales}


@view_config(route_name='get_sale', renderer='json')
def get_sale(request):
    sale = Sale.objects.get_or_404(id=request.matchdict['uid'])
    return {'sale': sale}


@view_config(route_name='add_sale', renderer='json', request_method='POST')
def add_sale(request):
    sale = Sale(**request.json_body)
    sale.save()
    return {'result': sale}


@view_config(route_name='edit_sale', renderer='json', request_method='POST')
def edit_sale(request):
    sale = Sale.objects.get_or_404(id=request.matchdict['uid'])
    sale.update(**Sale.convert_dict_to_update(request.json_body))
    return {'result': sale}


@view_config(route_name='remove_sale', renderer='json')
def remove_sale(request):
    sale = Sale.objects.get_or_404(id=request.matchdict['uid'])
    sale.delete()
    return {'result': sale}
