// const pessoa ={
//     nome:"Alessandro",
//     idade:"40"
// }
// const funcao = {
//     cargo:"gerente",
//     salario:5000
// }

const { name } = require("browser-sync");

// const funcionario = {
//     ...pessoa,
//     ...funcao
// }
// // console.log(funcionario);
// const files = [
//     {
//       "fieldname": "photos",
//       "originalname": "asinhas.png",
//       "encoding": "7bit",
//       "mimetype": "image/png",
//       "destination": "./public/images",
//       "filename": "1627170053760-asinhas.png",
//       "path": "public\\images\\1627170053760-asinhas.png",
//       "size": 386889
//     },
//     {
//       "fieldname": "photos",
//       "originalname": "burger.png",
//       "encoding": "7bit",
//       "mimetype": "image/png",
//       "destination": "./public/images",
//       "filename": "1627170053794-burger.png",
//       "path": "public\\images\\1627170053794-burger.png",
//       "size": 342565
//     },
//     {
//       "fieldname": "photos",
//       "originalname": "chef.png",
//       "encoding": "7bit",
//       "mimetype": "image/png",
//       "destination": "./public/images",
//       "filename": "1627170053851-chef.png",
//       "path": "public\\images\\1627170053851-chef.png",
//       "size": 54663
//     }
//   ]

 
//   files.map(function(file,pos,arr){
//           console.log(pos,{...file});
//         })
 
// data.recipe_id,              
// data.file_id   

  // const filesIds = [
  //     292,
  //     294,
  //     293,
  //     295
  //   ]

  // const recipeId = 272

  // for (const id of filesIds) {
  //     console.log({recipe_id:recipeId,file_id:id});
  // }                     
  
//   filesIds.map(id =>{
//       console.log({recipe_id:recipeId,file_id:id});
//   


const results = [
  {
    "id": 172,
    "name": "1627346171520-logo.png",
    "path": "public\\images\\1627346171520-logo.png",
    "recipe_id": 279,
    "file_id": 323
  },
  {
    "id": 173,
    "name": "1627346171525-pizza.png",
    "path": "public\\images\\1627346171525-pizza.png",
    "recipe_id": 279,
    "file_id": 324
  }
]

const arr = results.map(file =>({
 ...file,

src:`http://localhost:3000/images/${file.name}`
}))

console.log(arr);