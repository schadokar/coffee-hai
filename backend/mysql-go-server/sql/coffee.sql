/* Drop coffeedb and create a new one */
DROP DATABASE IF EXISTS coffeedb;

CREATE DATABASE IF NOT EXISTS coffeedb;

/* Use CoffeeDB */
USE coffeedb;

/* --------------------------------Orders Table------------------------------------------ */

/* Drop orders Table and create a new one */
DROP TABLE IF EXISTS coffeedb.orders;

CREATE TABLE IF NOT EXISTS coffeedb.orders (
  orderID VARCHAR(40),
  merchantID VARCHAR(40),
  deliveryID VARCHAR(40), 
  customerID VARCHAR(40),
  orderStatus ENUM  ("order_created","order_ready", "order_picked", "delivered", "cancelled") DEFAULT "order_created", 
  PRIMARY KEY (orderID)
);

/* --------------------------------Merchant Table------------------------------------------ */
/* Drop merchant table and create a new one */
DROP TABLE IF EXISTS coffeedb.merchant;

CREATE TABLE IF NOT EXISTS coffeedb.merchant (
  userID VARCHAR(40),
  name VARCHAR(40),
  PRIMARY KEY (userID)
);

/* --------------------------------Delivery Table------------------------------------------ */
/* Drop delivery table and create a new one */
DROP TABLE IF EXISTS coffeedb.delivery;

CREATE TABLE IF NOT EXISTS coffeedb.delivery (
  userID VARCHAR(40),
  name VARCHAR(40),
  PRIMARY KEY (userID)
);

/* --------------------------------Customer Table------------------------------------------ */
/* Drop customer table and create a new one */
DROP TABLE IF EXISTS coffeedb.customer;

CREATE TABLE IF NOT EXISTS coffeedb.customer (
  userID VARCHAR(40),
  name VARCHAR(40),
  PRIMARY KEY (userID)
);