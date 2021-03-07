const express = require("express");
const bodyParser = require("body-parser");
const models = require("../db/models");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/list", async (req, res, next) => {
  try {
    const queryParams = req.query;
    const limit = 10;
    const offset = (queryParams.pageIndex - 1) * limit;
    const where = {};
    if (queryParams.status) {
      where.status = queryParams.status;
    }
    const list = await models.Todo.findAndCountAll({
      where,
      limit,
      offset,
    });
    res.json({
      list: list,
      message: "查询成功",
    });
  } catch (err) {
    next(err);
  }
});

app.post("/create", async (req, res, next) => {
  try {
    const bodyParams = req.body;
    const todo = await models.Todo.create({
      content: bodyParams.content,
      deadline: bodyParams.deadline,
    });
    res.json({
      data: todo,
      message: "创建成功",
    });
  } catch (err) {
    next(err);
  }
});

app.post("/update", async (req, res, next) => {
  const bodyParams = req.body;
  try {
    const todo = await models.Todo.findOne({
      where: {
        id: bodyParams.id,
      },
    });
    if (todo) {
      todo.update({
        content: bodyParams.content,
        deadline: bodyParams.deadline,
      });
    }
    res.json({
      data: todo,
      message: "更新成功",
    });
  } catch (err) {
    next(err);
  }
});

app.post("/delete", async (req, res) => {
  const bodyParams = req.body;
  res.json({
    message: "删除成功",
  });
});

app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
});
app.listen(3000, () => {
  console.log("服务启动成功");
});
