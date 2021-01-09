const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match =>
    match.toUpperCase()
  );

const generatePDF = async (name, imgUrl, extension) => {
  const { PDFDocument, rgb } = PDFLib;
  const exbytes = await fetch('./cert1.pdf').then(res => {
    return res.arrayBuffer();
  });

  const exFont = await fetch('./Sanchez-Regular.ttf').then(res => {
    return res.arrayBuffer();
  });
  const UserImgByter = await fetch(`${imgUrl}`).then(res => {
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(exbytes);
  pdfDoc.registerFontkit(fontkit);
  const myFont = await pdfDoc.embedFont(exFont);

  const pages = pdfDoc.getPages();
  const firstPg = pages[0];
  if(extension == 'image/jpeg'){
    const UserImg = await pdfDoc.embedJpg(UserImgByter);
    firstPg.drawImage(UserImg, {
      x: 70,
      y: 380,
      width: 100,
      height: 100,
    });
  }else{
    const UserImg = await pdfDoc.embedPng(UserImgByter)
    firstPg.drawImage(UserImg, {
      x: 70,
      y: 380,
      width: 100,
      height: 100,
    });
  }
  
  firstPg.drawText(name, {
    x: 70,
    y: 230,
    size: 44,
    font: myFont,
    color: rgb(0, 0, 0.51),
  });


  const pdfBytes = await pdfDoc.save();
  console.log('Done creating');

  const file = new File([pdfBytes], 'certify-me.pdf', {
    type: 'application/pdf;charset=utf-8',
  });
  saveAs(file);
};

const submitBtn = document.getElementById('submit');
const inputVal = document.getElementById('name');
const imgVal = document.getElementById('img');



imgVal.addEventListener('change', function () {
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    localStorage.setItem('userImg', reader.result);
  });

  reader.readAsDataURL(this.files[0]);
});



submitBtn.addEventListener('click', () => {
  const val = capitalize(inputVal.value);

  const userImgDataUrl = localStorage.getItem('userImg');
  const extension = imgVal.files[0].type

  console.log(extension);
  if (val.trim() !== '' && inputVal.checkValidity()) {
    generatePDF(val, userImgDataUrl, extension);
  } else {
    inputVal.reportValidity();
  }
});
