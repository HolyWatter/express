export const getAllTodo = async (req, res) => {
  const user = req.user;
  const todos = await req.prisma.todo.findMany({
    where: {
      createdById: user.id,
    },
    include: {
      createdBy: true,
    },
  });

  res.status(200).json({data :todos});
};

export const createTodo = async (req, res) => {
  const user = req.user;
  const { title, completed } = req.body;
  const newTodo = await req.prisma.todo.create({
    data: { title, completed, createdById: user.id },
  });
  res.status(200).json(newTodo);
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  await req.prisma.todo.delete({
    where: {
      id: id,
    },
  });
  res.sendStatus(204);
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const updatedTodo = await res.prisma.todo.update({
    where: {
      id: id,
    },
    data: {
      title,
      completed,
    },
  });
  res.status(200).json(updatedTodo);
};
