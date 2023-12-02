import unittest
import requests


class TestProductAPI(unittest.TestCase):

    # Testa a inserção de um produto válido
    def test_insert_product_valid(self):
        data = {
            "name": "Produto de Teste",
            "description": "Descrição do Produto de Teste",
            "value": 00.99,
            "quantity": 100,
            "category": "Teste",
            "password": "123456"
        }
        response = requests.post(
            'http://localhost:5000/api/insert/products', json=data)
        self.assertEqual(response.status_code, 200)
        product = response.json()
        self.assertIsInstance(product, dict)
        self.assertIn("name", product)
        self.assertIn("description", product)
        self.assertIn("value", product)
        self.assertIn("quantity", product)
        self.assertIn("category", product)

    # Testa a inserção de um produto com nome inválido
    def test_insert_product_invalid_name(self):
        data = {
            "name": "12345",
            "description": "Descrição do Produto de Teste",
            "value": 00.99,
            "quantity": 100,
            "category": "Teste"
        }
        response = requests.post(
            'http://localhost:5000/api/insert/products', json=data)
        self.assertEqual(response.status_code, 400)
        error = response.json()
        self.assertIsInstance(error, dict)
        self.assertIn("error", error)

    # Testa a inserção de um produto com categoria inválida
    def test_insert_product_invalid_category(self):
        data = {
            "name": "Produto de Teste",
            "description": "Descrição do Produto de Teste",
            "value": 00.99,
            "quantity": 100,
            "category": "Categoria#Teste"
        }
        response = requests.post(
            'http://localhost:5000/api/insert/products', json=data)
        self.assertEqual(response.status_code, 400)
        error = response.json()
        self.assertIsInstance(error, dict)
        self.assertIn("error", error)

    # Testa a inserção de um produto com valor inválido
    def test_insert_product_invalid_value(self):
        data = {
            "name": "Produto de Teste",
            "description": "Descrição do Produto de Teste",
            "value": "ValorInválido",
            "quantity": 100,
            "category": "Teste"
        }
        response = requests.post(
            'http://localhost:5000/api/insert/products', json=data)
        self.assertEqual(response.status_code, 400)
        error = response.json()
        self.assertIsInstance(error, dict)
        self.assertIn("error", error)

    # Testa a inserção de um produto com quantidade inválida
    def test_insert_product_invalid_quantity(self):
        data = {
            "name": "Produto de Teste",
            "description": "Descrição do Produto de Teste",
            "value": 00.99,
            "quantity": "QuantidadeInválida",
            "category": "Teste"
        }
        response = requests.post(
            'http://localhost:5000/api/insert/products', json=data)
        self.assertEqual(response.status_code, 400)
        error = response.json()
        self.assertIsInstance(error, dict)
        self.assertIn("error", error)


if __name__ == '__main__':
    unittest.main()
