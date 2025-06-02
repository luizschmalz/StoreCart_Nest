# Carrinho de compras + NestTs

## Para rodar a aplicação, comece clonando o repositório e depois instalando as dependências  

```bash
git clone https://github.com/luizschmalz/StoreCart_Nest.git
cd StoreCart_Nest
npm install
```
## Antes de rodar o projeto é necessário configurar as variáveis de ambiente e criar o cliente do prisma, para isso:

```bash
##crie um arquivo .env na raiz com esses valores
DATABASE_URL="file:./sqlite.db"
JWT_SECRET="jwtsecrethahahahahtestelol"
```

```bash
npx prisma generate
```

## Para ver as tabelas e valores do banco de dados, pode usar o comando: 

```bash
npx prisma studio
```

## Agora sim podemos rodar o projeto

```bash
npm run start
```

## Essa API também contém Swagger UI, com todos schemas e rotas da aplicação, para acessar basta entrar na rota /api

## Realizar testes 

```bash
npm test 
# ou src/caminho para testar arquivos diferentes com 
npm test src/cart_products/cart_products.service.spec.ts # para testar cart_products.service
```

## Explicação do funcionamento do banco de dados

#### Agora vou explicar o funcionamento da API e o banco de dados:
<ul>
 <li>Inicialmente é necessário se cadastrar e realizar o login na rota /auth para conseguir o token de acesso.</li>
<li>Depois disso, você cria um carirnho na rota /carts passando o ID do usuário criado.</li>
<li>Para adicionar itens no carrinho, é necessário acessar a rota /cart-products e passando os parâmetros: itemId, carrinhoId e quantidade, criar o item no carrinho, nessa rota é possível alterar a quantidade do item ou remover do carrinho.</li>
<li>Para finalizar o carrinho, na rota /carts, é necessário atualizar o status dele para 'concluido', ao fazer isso, as outras rotas não conseguirão fazer alterações nele e o servidor vai retornar o total do carrinho.</li>
</ul>
