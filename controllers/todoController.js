export const getAllTodo = async (req, res) => {
  const todos = await req.prisma.todo.findMany();

  res.json(todos);
};

export const createTodo = async (req, res) => {
  const { title, completed } = req.body;
  const newTodo = await req.prisma.todo.create({
    data: { title, completed },
  });
  res.json(newTodo);
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  await res.prisma.todo.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.sendStatus(204);
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const updatedTodo = await res.prisma.todo.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title,
      completed,
    },
  });
  res.json(updatedTodo);
};
