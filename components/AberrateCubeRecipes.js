
export class AberrateCubeRecipes {
  static cubeInfo = [
    { id: 0, name: "White", level: 0, type: 0 },
    { id: 1, name: "Red", level: 1, type: 0 },
    { id: 2, name: "Blue", level: 1, type: 1 },
    { id: 3, name: "Green", level: 1, type: 2 },
    { id: 4, name: "Triple", level: 3, type: 0 },
    { id: 5, name: "RedBlue", level: 2, type: 0 },
    { id: 6, name: "RedGreen", level: 2, type: 1 },
    { id: 7, name: "BlueGreen", level: 2, type: 2 }
  ];

  static fuseRecipes = [
    { input: [1, 2], output: 5 },
    { input: [1, 3], output: 6 },
    { input: [2, 3], output: 7 },
    { input: [1, 7], output: 4 },
    { input: [2, 6], output: 4 },
    { input: [3, 5], output: 4 },
    //{ input: [1, 2, 3], output: 4 }
  ];

  static defuseRecipes = [
    { input: 4, output: [1, 2, 3] },
    { input: 5, output: [1, 2] },
    { input: 6, output: [1, 3] },
    { input: 7, output: [2, 3] }
  ];
}
