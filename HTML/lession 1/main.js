// var a = 1;
// var b = 2;

// var c = a > b;

// console.log(c);

// function showDialog() {
//     alert('hi')
// }

// showDialog();

// function writeLog() {
//     var myString = '';
//     for (var param of arguments) {
//         myString += `${param} - `
//     }
//     console.log(myString);
// }

// writeLog('Log 1', 'Log 2', 'Log 3');

//Declaration function
// function showMessage() {

// }

//Expression function
// var showMessage2 = function() {}

// Một số case sử dụng backslash

// var fullName = 'Son Dang là \'sieu nhan\'' //Son Dang là 'sieu nhan'

// Xem độ dài chuỗi

// console.log(fullName.length);

//Template String
// var firstName = 'Son';
// var lastName = 'Dang';

// console.log(`Toi là: ${firstName} ${lastName}`);

//Làm việc với chuỗi
// var myStrong = '    Hoc JS tai F8! JS    ';
//2. Find index
// console.log(myStrong.indexOf('JS',5));

// console.log(myStrong.search('JS'));

//3. Cut String
// console.log(myStrong.slice(4,6));

//4. Replace: ghi đè
// console.log(myStrong.replace('JS', 'JavaScript'))

//biểu thức chính quy ghi đè được tất cả các chữ trong chuỗi

// console.log(myStrong.replace(/JS/g, 'JavaScript'))

//5. Chuyển đổi tất cả các chữ trong chuỗi thành chữ hoa/thường
// console.log(myStrong.toLowerCase());

//6. Trim: loại bỏ ký tự khoảng trắng thừa ở 2 đầu trong chuỗi
// console.log(myStrong.trim());

//8. Split: cắt 1 chuỗi thành 1 array
// var languge = 'JS, PHP, Ruby';
// console.log(languge.split(', ')); //phải tìm điểm chung của từng thành phần 

//9.Get a character by index
// const myStrong2 = 'Son Dang';

// console.log(myStrong2.charAt(0))

// var languges = [
//     'JavaScript',
//     'PHP',
//     'Ruby'
// ];

// var languges2 = [
//     'Dart',
//     'Java'
// ];

// //console.log(languges.pop()); //xóa phần tử cuối của mảng và trả về phần tử đó

// // console.log(languges.unshift('Dart', 'Java'));

// console.log(languges.concat(languges2));
// console.log(languges);

// console.log(languges.join(' - '))

// function getLastElement(array) {
//     var x = array.length;
//     return array[x-1];
// } // Viết hàm tại đây




// // Ví dụ sử dụng
// var animals = ['Monkey', 'Tiger', 'Elephant'];
// var result = getLastElement(animals);

// console.log(result); // Expected: "Elephant"
//console.log(animals); // Expected: ['Monkey', 'Tiger', 'Elephant']

// var emailKey = 'email';

// var myInfo = {
//     name: 'Truong',
//     age: 18,
//     address: 'HaNoi',
//     [emailKey]: 'abc@gmail.com',
//     getName: function() {
//         return this.name;
//     }
// };

// console.log(myInfo.getName());

//object constructor

// function User(firstName, lastName, avatar) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.avatar = avatar;

//     this.getName = function() {
//         return `${this.firstName} ${this.lastName}` //this gọi từ ông nào thì trả về ông đó
//     }
// }

// var author = new User('Truong', 'Van', 'Avatar');
// var user = new User('He', 'Van', 'Avatar');

// author.title = 'abc';
// user.comment = 'hahaha';

// console.log(author);
// console.log(user);

//Đối tượng Date

// var date = new Date();

// console.log(date)

// var course = {
//     name: 'Java',
//     coin: 250
// };

// var result = course.coin > 0 ? `${course.coin} Coins` : 'Miễn phí';
// console.log(result);

//For loop

// for (var i = 100; i >0; i--){
//     console.log(i);
// }

// var orders = [
//     {
//         name: 'Khóa học HTML - CSS Pro',
//         price: 3000000
//     },
//     {
//         name: 'Khóa học Javascript Pro',
//         price: 2500000
//     },
//     {
//         name: 'Khóa học React Pro',
//         price: 3200000
//     }
  
// ]
// function getTotal(orders) {
// var sum = 0;
// var ordersLength = orders.length;
// for (var i = 0; i < ordersLength; i++){
//     sum = sum + orders[i].price;
// }
// return sum;
// }

// console.log(getTotal(orders));

// var languges = [
//     'Javescript',
//     'PHP',
//     'Java'
// ];

// for (var value of languges) {
//     console.log(value);
// }

// while loop

// var i = 0;

// while (i<1000) {
//     console.log(i);
//     i++;
// }

// do/while loop sẽ thực hiện câu lệnh đầu tiên mà không cần kiểm tra điều kiện, chỉ kiểm tra điều kiện từ lần lặp thứ 2 trở đi

// var i = 0;

// do {
//     i++

//     console.log(i);

// }while (i<10)

// Vòng lặp lồng nhau - Nested loop

// var myArray = [
//     [1, 2],
//     [3, 4],
//     [5,6]
// ];

// for (var i = 0; i < myArray.length; i++) {
//     for(var j = 0; j <myArray[i].length; j++) {
//         console.log(myArray[i][j]);
//     }
// }

// var course = courses.find(function(course, index) {
//     return course.name === 'Ruby';
// }); //courses là 1 array

// const sports = [
//     {
//         name: 'Bóng rổ',
//         like: 6
//     },
//     {
//         name: 'Bơi lội',
//         like: 5
//     },
//     {
//         name: 'Bóng đá',
//         like: 10
//     },
// ]

// function getMostFavoriteSport(array) {
//     var listsport = array.filter(function(sport) {
//         return sport.like > 5;
//     });
//     return listsport
// }


// // Kỳ vọng
// console.log(getMostFavoriteSport(sports)) 
// Output: [{ name: 'Bóng rổ, like: 6 }, { name: 'Bóng đá, like: 10 }]

// var newCourses = sports.map((sport, index, originArray)=> {
//     // console.log(course);
//     return {
//         name: `Mon: ${sport.name}`,
//         like: sport.like,
//         coin: 'Free',
//         index: index,
//         originArray: originArray, //originArray là array gốc đang sửa
//     } 
// });

// console.log(newCourses);

// var i = 0;

// function coinHandler(accumulator, currentValue, currentIndex, originArray) {
//     i++;

//     // console.table({
//     //     'Lượt chạy ': i,
//     //     'Biến tích trữ': accumulator
//     // });

//     return accumulator + currentValue.like; //return ra cái gì thì gán vào biến accumulator giá trị đó bắt đầu từ lần thứ 2

// };

// array reduce() method

// var totalCoin = sports.reduce(function(accumulator, currentValue){
//     return accumulator + currentValue.like;
// }, 0);// số 0 là giá trị khởi tạo gán vào accumulator trong lần đầu tiên truyền, nó quyết định kiểu dữ liệu được lấy ra của reduce()
// // currentValue là biến trả về phần tử theo từng lần của array
// console.log(totalCoin);

//Flat-"Làm phẳng" mảng từ Depth array - "Mảng sâu"
// var depthArray = [1, 2, [3, 4], 5, 6, [7, 8, 9]];

// var flatArray = depthArray.reduce(function(flatOut, depthItem) {
//     return flatOut.concat(depthItem);
// }, []);
// console.log(flatArray);

// var topics = [
//     {
//         topic: "Front-end",
//         courses: [
//             {
//                 id: 1,
//                 title: "HTML, CSS"
//             },
//             {
//                 id: 2,
//                 title: "Javascript"
//             },
//         ]
//     },
//     {
//         topic: "Back-end",
//         courses: [
//             {
//                 id: 1,
//                 title: "PHP"
//             },
//             {
//                 id: 2,
//                 title: "NodeJS"
//             },
//         ]
//     },
// ]

// var newCourses = topics.reduce(function(courses, topic){
//     return courses.concat(topic.courses);
// }, []);

// console.log(newCourses);
// // ứng dụng để tạo mã html
// var htmls = newCourses.map(function(course) {
//     return `
//     <div>
//         <h2>${course.title}</h2>
//         <p>ID: ${course.id}</p>
//     </div>
//     `;
// })

// console.log(htmls.join(''));


//Tự tạo phương thức map
// Array.prototype.map2 = function(callback) {
//     var output = [], arrayLength = this.length;

//     for (var i = 0; i < arrayLength; i++) {
//        var result = callback(this[i], i);
//        output.push(result);
//     }

//     return output;
// }

// var courses = [
//     'Javascript',
//     'PHP',
//     'Ruby'
// ];

// var htmls = courses.map2(function(course, index){
//     return `<h2>${course}</h2>`;
// });

// console.log(htmls.join(''));


//Tự tạo phương thức forEach
// Array.prototype.forEach2 = function(callback) {
//     for (var index in this) {
//         if(this.hasOwnProperty(index)){
//             callback(this[index], index, this);
//         }
//     }
// }

// var courses = [
//     'Javascript',
//     'PHP',
//     'Ruby'
// ];

// courses.forEach2(function(coures, index, array){
//     console.log(coures, index, array);
// })


//Tự tạo phương thức filter

// Array.prototype.filter2 =function(callback) {
//     var output = [];
//     for (var index in this) {
//         if(this.hasOwnProperty(index)){
//             var result = callback(this[index], index, this)
//             if(result) {
//             output.push(this[index]);
//             }
//         }
//     }
//     return output;
// }

// const sports = [
//     {
//         name: 'Bóng rổ',
//         like: 6
//     },
//     {
//         name: 'Bơi lội',
//         like: 5
//     },
//     {
//         name: 'Bóng đá',
//         like: 10
//     },
// ]

// var filerSports = sports.filter2(function(sport, index, array) {
//     return sport.like > 5;
// });

// console.log(filerSports);


//Tự tạo phương thức some

// Array.prototype.some2 = function(callback) {
//     for (var index in this) {
//         if(this.hasOwnProperty(index)){
//             if (callback(this[index], index, this)) {
//             return true
//             }
//         }
//     }
//     return false
// }

// const sports = [
//     {
//         name: 'Bóng rổ',
//         like: 6,
//         isFinish: false
//     },
//     {
//         name: 'Bơi lội',
//         like: 5,
//         isFinish: false
//     },
//     {
//         name: 'Bóng đá',
//         like: 10,
//         isFinish: false
//     },
// ]

// var result = sports.some2(function(sport, index, array) {
//     return sport.isFinish;
// })

// console.log(result);

//Tự tạo phương thức every

// Array.prototype.every2 = function(callback) {
//     for (var index in this) {
//         if(this.hasOwnProperty(index)){
//             if (!callback(this[index], index, this)) {
//             return false
//             }
//         }
//     }
//     return true
// }

// const sports = [
//     {
//         name: 'Bóng rổ',
//         like: 6,
//         isFinish: true
//     },
//     {
//         name: 'Bơi lội',
//         like: 5,
//         isFinish: true
//     },
//     {
//         name: 'Bóng đá',
//         like: 10,
//         isFinish: true
//     },
// ]

// var result = sports.every2(function(sport, index, array) {
//     return sport.like > 5;
// })

// console.log(result);

// var headingNode = document.getElementById('heading');

// console.log(headingNode);

// var headNodes = document.getElementsByClassName('head');

// console.log(headNodes);


// var productNode = document.querySelector('.product-1');
// console.log(productNode);

// var product1Node = productNode.getElementsByTagName('li');
// console.log(product1Node);
// Javascript

// var headingElement = document.querySelector('.heading');

// console.log(headingElement.innerText)
// console.log(headingElement.textContent)



//innerHTML, outerHTML

//  var boxElement = document.querySelector('.box');

// boxElement.innerHTML = '<h1>Heading</h1>'


// var courses = ['HTML & CSS', 'Javascript', 'PHP', 'Java']

// var htmls = courses.map(function(course, index) {     
//     return `${<li>course</li>}`
// })

// console.log(htmls.join(''));


// var boxElement = document.querySelector('.box');
// boxElement.style.width = '100px';
// boxElement.style.height = '120px';
// boxElement.style.backgroundColor = 'red';

// var h1Element = document.querySelector('h1');

// h1Element.onclick = function() {
//     console.log(Math.random());
// }
// //Nếu muốn lấy chính bản thân element
// var h1Element = document.querySelector('h1');

// h1Element.onclick = function(e) {
//     console.log(e.target);
// }

//DOM Event

//1.Input/select

// var inputElement = document.querySelector('input[type="text"]');

// inputElement.onkeydown = function(e) {
//     console.log(e);
// }

//2. key up/down

// inputElement.onkeyup = function(e) {
//     console.log(e.which);

//     switch(e.which) {
//         case 27:
//             console.log('Exit');
//             break;
//     }
// }

// var aElements = document.links;
// console.log(aElements)
// for(var i = 0; i < aElements.length; i++) {
//     aElements[i].onclick = function(e) {
//         if(!e.target.href.startsWith('https://f8.edu.vn')) {
//             e.preventDefault();
//         }
//     }
// }

// document.querySelector('div').onclick = () => {
//     console.log('DIV');
// }

// document.querySelector('button').onclick = (e) => {
//     e.stopPropagation();
//     console.log('Click me');
// }

// var btn = document.getElementById('btn');

// console.log(btn);
 
//1. XỬ lý nhiều việc khi 1 event xảy ra

// btn.addEventListener('click', function(e) {
//     console.log('Event 1');
// })

// btn.addEventListener('click', function(e) {
//     console.log('Event 2');
// })

// btn.addEventListener('click', function(e) {
//     console.log('Event 3');
// })

//Gỡ bỏ lắng nghe event

// function viec1() {
//     console.log('Viec 1')
// }

// btn.addEventListener('click', viec1)
// setTimeout(function() {
//     btn.removeEventListener('click', viec1)
// },3000)

// var json = '{"name":"TruongTV", "age":18}';

// var a = '1'; // json

// console.log(JSON.parse(a))

// console.log(JSON.stringify('abc'))

// Promise
//      -Sync
//      -Async



 