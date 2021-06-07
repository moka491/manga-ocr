import cv, { CCL_DEFAULT } from "@techstark/opencv-js";

let imgElement = document.getElementById("srcImage");

setTimeout(() => {
  let mat = cv.imread(imgElement);

  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);

  cv.GaussianBlur(mat, mat, new cv.Size(3, 3), 1);

  cv.threshold(mat, mat, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

  let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(8, 8));
  cv.dilate(mat, mat, kernel, new cv.Point(-1, -1), 1);

  let labels = new cv.Mat();
  let stats = new cv.Mat();
  let centroids = new cv.Mat();

  let numLabels = cv.connectedComponentsWithStats(
    mat,
    labels,
    stats,
    centroids,
    8
  );

  cv.cvtColor(mat, mat, cv.COLOR_GRAY2RGB);

  console.log(numLabels);
  for (let i = 0; i < numLabels; i++) {
    const p1 = new cv.Point(
      stats.intPtr(i, cv.CC_STAT_LEFT)[0],
      stats.intPtr(i, cv.CC_STAT_TOP)[0]
    );

    const p2 = new cv.Point(
      stats.intPtr(i, cv.CC_STAT_LEFT)[0] +
        stats.intPtr(i, cv.CC_STAT_WIDTH)[0],
      stats.intPtr(i, cv.CC_STAT_TOP)[0] + stats.intPtr(i, cv.CC_STAT_HEIGHT)[0]
    );

    const maxWidth = p2.x - p1.x > 150;
    const maxHeight = p2.y - p1.y > 500;

    if (maxWidth || maxHeight) continue;

    cv.rectangle(
      mat,
      p1,
      p2,
      new cv.Scalar(
        128 * Math.random() + 70,
        128 * Math.random() + 70,
        128 * Math.random() + 70
      ),
      5,
      2
    );
  }

  cv.imshow("outputCanvas", mat);
  mat.delete();
}, 1500);
