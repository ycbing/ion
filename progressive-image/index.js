const sharp = require('sharp');

// 输入图片路径和输出路径
const inputImagePath = './image/input.jpeg';
const outputImagePath = './image/progressive.jpg';

// 使用 sharp 进行图片处理
sharp(inputImagePath)
  .jpeg({ progressive: true }) // 设置 progressive 为 true
  .toFile(outputImagePath, (err, info) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Image processed successfully:', info);
    }
  });
