from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=200)
    pub_date = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.nombre
    
class Producto(models.Model):
    descripcion = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=6,decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE) 
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.descripcion