from rest_framework import serializers

from tienda.models import Categoria,Producto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'
        
class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Producto
        fields = ['id', 'descripcion', 'precio', 'categoria', 'categoria_nombre']