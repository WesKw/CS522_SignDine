import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('sample_db.db');
db.execSync("\
    pragma case_sensitive_like = false;\
    create table if not exists Restaurants (id PRIMARY KEY, name, street, city, state, zip, lat, long);\
    create table if not exists Reviews (id PRIMARY KEY, restaurant_id INTEGER, overall INTEGER, staff INTEGER, asl INTEGER, notes TEXT);\
    create table if not exists Users (id PRIMARY KEY, username, password, first, last, anonymous);\
    delete from Restaurants;\
    delete from Reviews;\
    delete from Users;\
    insert into Restaurants (name, street, city, state, zip, lat, long) values ('Busy Burger', '1120 W Taylor St.', 'Chicago', 'IL', '60607', 41.8695156080526, -87.6551537049415);\
    insert into Restaurants (name, street, city, state, zip, lat, long) values ('The Purple Pig Restaurant', '444 Michigan Ave', 'Chicago', 'IL', '60611', 41.8905643993643, -87.6241699123644);\
    insert into Restaurants (name, street, city, state, zip, lat, long) values ('The Berghoff Restaurant', '17 W Adams St', 'Chicago', 'IL', '60603', 41.8790624062323, -87.6284614465708);\
    insert into Restaurants (name, street, city, state, zip, lat, long) values ('Bungalow By Middle Brow', '2840 W Armitage Ave', 'Chicago', 'IL', '60647', 41.9178024475737, -87.6990553881211);\
    insert into Restaurants (name, street, city, state, zip, lat, long) values ('Tuscany on Taylor', '1014 W Taylor St', 'Chicago', 'IL', '60607', 41.8696052680275, -87.651887241632);\
    insert into Restaurants (name, street, city, state, zip, lat, long) values ('Little Joes', '1041 W Taylor St', 'Chicago', 'IL', '60607', 41.8693016702484, -87.6527884638635);\
    insert into Restaurants (name, street, city, state, zip, lat, long) values ('Als #1 Italian Beef', '1079 W Taylor St', 'Chicago', 'IL', '60607', 41.8693496068359, -87.6540008223386);\
    insert into Users (username, password, first, last, anonymous) values ('user1', 'password', 'Wesley', 'Kwiecinski', 0);\
    insert into Users (username, password, first, last, anonymous) values ('user2', 'password', 'Dennis', 'Reynolds', 0);\
    insert into Users (username, password, first, last, anonymous) values ('user3', 'password', 'Dee', 'Reynolds', 0);\
    insert into Users (username, password, first, last, anonymous) values ('user4', 'password', 'Frank', 'Reynolds', 0);\
    insert into Users (username, password, first, last, anonymous) values ('user5', 'password', 'Charlie', 'Day', 0);\
    insert into Users (username, password, first, last, anonymous) values ('user6', 'password', 'John', 'Doe', 1);\
    insert into Reviews (restaurant_id, overall, staff, asl, notes) values (1, 4, 4, 0, 'Friendly staff');\
");