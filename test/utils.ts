import * as Database from "../src/database";

export function createOrderDummy(userId?: string, product?: string, amount? : number, description?: string) {
  var order = {
    product: product || "dummy order",
    amount : amount || 0,
    description: description || "I'm a dummy order!"
  };

  if (userId) {
    order["userId"] = userId;
  }

  return order;
}

export function createUserDummy(email?: string) {
  var user = {
    email: email || "dummy@mail.com",
    name: "Dummy Jones",
    userType : "customer",
    password: "123123"
  };

  return user;
}

export function clearDatabase(database: Database.IDatabase, done: MochaDone) {
  var promiseUser = database.userModel.remove({});
  var promiseOrder = database.orderModel.remove({});

  Promise.all([promiseUser, promiseOrder])
    .then(() => {
      done();
    })
    .catch(error => {
      console.log(error);
    });
}

export function createSeedOrderData(database: Database.IDatabase, done: MochaDone) {
  return database.userModel
    .create(createUserDummy())
    .then(user => {
      return Promise.all([
        database.orderModel.create(
          createOrderDummy(user._id, "Order 1", 990, "Some dummy data 1")
        ),
        database.orderModel.create(
          createOrderDummy(user._id, "Order 2", 990, "Some dummy data 2")
        ),
        database.orderModel.create(
          createOrderDummy(user._id, "Order 3", 990,"Some dummy data 3")
        )
      ]);
    })
    .then(order => {
      done();
    })
    .catch(error => {
      console.log(error);
    });
}

export function createSeedUserData(database: Database.IDatabase, done: MochaDone) {
  database.userModel
    .create(createUserDummy())
    .then(user => {
      done();
    })
    .catch(error => {
      console.log(error);
    });
}

export async function login(server, config, user) {
  if (!user) {
    user = createUserDummy();
  }

  return server.inject({
    method: "POST",
    url: config.routePrefix + "/users/login",
    payload: { email: user.email, password: user.password }
  });
}
