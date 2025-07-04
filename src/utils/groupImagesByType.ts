export const groupImagesByType = (images: any) => {
  return images.reduce((acc: any, image: any) => {
    const existingGroup = acc.find((group: any) => group.grupo === image.grupo);

    if (existingGroup) {
      existingGroup.data.push(image);
    } else {
      acc.push({ grupo: image?.grupo, data: [image] });
    }

    return acc;
  }, []);
};
