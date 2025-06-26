import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//requisição POST
app.post('/usuarios', async (req, res) => {
  try {
    const novoUsuario = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age // se o campo age for inteiro no schema
      }
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});
// Requisição GET com filtro opcional por query string
app.get('/usuarios', async (req, res) => {
  try {
    const { email, name, age } = req.query;

    let users = [];

    if (email || name || age) {
      users = await prisma.user.findMany({
        where: {
          ...(email && { email }),
          ...(name && { name }),
          ...(age && { age: Number(age) }),
        },
      });
    } else {
      users = await prisma.user.findMany();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});



//requisição PUT
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, age } = req.body;

    /*const usuarioAtualizado = */await prisma.user.update({
      where: {
        id: req.params.id //requisição do parametro id
      },
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age // se o campo age for inteiro no schema
      }
    })
    res.status(201).json(req.body);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});

//requisição DELETE
app.delete('/usuarios/:id', async (req, res) => {
 // try {
    await prisma.user.delete({
      where: {
        id: req.params.id //requisição do parametro id
      },
    })  
// } 
res.status(200).json({message:'Usuário Deletado com sucesso!'})     
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
