import cv from "@techstark/opencv-js";

let imgElement = document.getElementById("srcImage");

setTimeout(() => {
  let mat = cv.imread(imgElement);

  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);

  cv.threshold(mat, mat, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

  let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
  cv.dilate(mat, mat, kernel, new cv.Point(-1, -1), 1);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  cv.findContours(
    mat,
    contours,
    hierarchy,
    cv.RETR_LIST,
    cv.CHAIN_APPROX_SIMPLE
  );

  cv.cvtColor(mat, mat, cv.COLOR_GRAY2BGR);

  for (let i = 0; i < contours.size(); i++) {
    const rect = cv.boundingRect(contours.get(i));
    const area = cv.contourArea(contours.get(i));

    if (rect.width < 10 && rect.height < 10) continue;
    if (rect.width > 50 && rect.height > 50) continue;

    cv.drawContours(
      mat,
      contours,
      i,
      new cv.Scalar(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      ),
      2,
      cv.LINE_8
    );
  }

  cv.imshow("outputCanvas", mat);
  mat.delete();
}, 1500);
