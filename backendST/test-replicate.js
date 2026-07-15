import Replicate from 'replicate';

async function test() {
  const replicate = new Replicate({
    auth: "r8_Ti4qcLRP08lFP0t3rGMp51AJYkwW7zt2zA01Y",
  });

  try {
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          garm_img: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          human_img: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          garment_des: "A fashion garment",
        }
      }
    );
    console.log("Success:", output);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
