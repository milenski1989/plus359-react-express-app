"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBioService = void 0;
const database_1 = require("../database");
const Artworks_1 = require("../entities/Artworks");
const Artists_1 = require("../entities/Artists");
const ArtistsBios_1 = require("../entities/ArtistsBios");
//const userRepository = dbConnection.getRepository(User);
const artsRepository = database_1.dbConnection.getRepository(Artworks_1.Artworks);
const artistsRepository = database_1.dbConnection.getRepository(Artists_1.Artists);
const biosRepository = database_1.dbConnection.getRepository(ArtistsBios_1.ArtistsBios);
// //ok
// export const loginService = async (email: string, password: string) => {
//   let authenticated: boolean
//   try {
//     let userFound = await userRepository.findOne({
//       where: [{email: email}, {userName: email}]
//     })
//     if (userFound) {
//      authenticated = await bcrypt.compare(password, userFound.password)
//      if (authenticated) return userFound
//     } else return userFound
//   } catch(error) {
//    throw new Error("Invalid credentials");
//   }
// };
// //ok
//  export const signupService = async (email: string, password: string, userName: string) => {
//   let user: object
//   let userFound = await userRepository.findOneBy({
//     email: email
//   })
//   try {
//      if (!userFound) {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) throw new Error("Signup failed!");
//         user = userRepository.create({
//           email: email,
//           password: hash,
//           userName: userName,
//           superUser: 1
//         })
//         await dbConnection.getRepository(User).save(user)
//       })
//      } else {
//       throw new Error("exists");
//      }
//   } catch {
//     throw new Error("Error occured while registering!");
//   }
// };
// export const uploadService = async (
//     title: string,
//     artist: string,
//     technique: string,
//     dimensions: string,
//     price: number,
//     notes: string,
//     storageLocation: string,
//     cell: string,
//     position: number,
//     image_url: string,
//     image_key: string,
//     download_url: string,
//     download_key: string,
//     by_user: string) => {
//       let newEntry: object
//       try {
//         newEntry = await artsRepository.create({
//           title,
//           artist,
//           technique,
//           dimensions,
//           price,
//           notes,
//           storageLocation,
//           cell,
//           position,
//           image_url,
//           image_key,
//           download_url,
//           download_key,
//           by_user
//         })
//         const results = await artsRepository.save(newEntry)
//         return results;
//       } catch {
//         throw new Error("Upload failed");
//       }
//     }
// export const getArtsService = async (name: string, page: string, count: string, sortField?: string, sortOrder?: string) => {
//  try {
//   const [arts, artsCount] = await artsRepository.findAndCount({
//     order: {[sortField] : sortOrder.toUpperCase()},
//     where:{storageLocation: name},
//  take: parseInt(count),
//  skip: (parseInt(count) * parseInt(page)) - parseInt(count)
//   })
//   return [arts, artsCount]
//  } catch {
//   throw new Error("Fetch failed!");
//  }
// };
// export const getBioService = async(name: string) => {
//   try {
//     let bio: ArtistsBios
//     const artist = await artistsRepository.findOne({
//       where: {
//         artist: name
//       }
//     })
//     if (!artist) {
//       throw new Error('Artist not found!')
//     } else {
//       bio = await biosRepository.findOne({
//         where: {
//           id: artist.id,
//       },
//     })
//     }
//   return bio
//   } catch {
//     throw new Error('No bio for this artist found!')
//   }
// }
const updateBioService = (id, bio) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioFound = yield biosRepository.findOneBy({
            id: id
        });
        yield biosRepository.merge(bioFound, Object.assign(Object.assign({}, bioFound), { bio: bio }));
        const results = yield biosRepository.save(bioFound);
        return results;
    }
    catch (error) {
        console.log({ error });
        throw new Error("Could not update entry");
    }
});
exports.updateBioService = updateBioService;
// export const searchService = async (params: string) => {
//   try {
//    const results = await artsRepository.find(
//    { where: [
//     {artist:  Like(`%${params}%`)},
//     {technique: Like(`%${params}%`)},
//     {title: Like(`%${params}%`)},
//     {storageLocation: Like(`%${params}%`)},
//     {dimensions: Like(`%${params}%`)},
//     {notes: Like(`%${params}%`)}
//   ],
//   order: {
//     id: "DESC",
// },
// })
//    return results
//   } catch {
//    throw new Error("Fetch failed!");
//   }
//  };
//  export const getCellsService = async (cell: string) => {
//   try {
//     const results = await artsRepository.find({
//       where: {
//         cell: cell
//       }
//     })
//     return results
//   } catch {
//     throw new Error("Error getting free positions in the selected cell");
//   }
// };
// export const deleteArtService = async (id) => {
//   try {
//     const results = await artsRepository.delete(id)
//     return results;
//   } catch {
//     throw new Error("Could not delete the entry!");
//   }
// };
// export const updateArtService = async (
//     title: string,
//     artist: string,
//     technique: string,
//     dimensions: string,
//     price: number,
//     notes: string,
//     storageLocation: string,
//     cell: string,
//     position: number,
//     by_user: string,
//     id: number
// ) => {
//         const updatedEntry = { title,
//           artist,
//           technique,
//           dimensions,
//           price,
//           notes,
//           storageLocation,
//           cell,
//           position,
//           by_user}
//         try {
//           const item = await artsRepository.findOneBy({
//             id: id
//         })
//         await artsRepository.merge(item, updatedEntry)
//         const results = await artsRepository.save(item)
//         return results
//         } catch {
//         throw new Error("Could not update entry")
//         }
// };
// export const updateLocationService = async(ids: number[], formControlData: {
//   storageLocation: string,
//   cell: string,
//   position: number
// }) => {
//   const {storageLocation, cell, position} = formControlData
//   const promises = []
//   try {
//     const images = await artsRepository.findBy({
//       id: In([ids])
//   })
//   for (let image of images) {
//     promises.push(await artsRepository.save({
//       id: image.id,
//       storageLocation: storageLocation,
//       cell: cell || '',
//       position: position || 0
//     }))
//   }
//   const result = await Promise.all(promises)
//   return result
//   } catch {
//   throw new Error("Could not update locations!")
//   }
// }
// export const createCertificateService = (imageSrc, bio, artist, title, technique, dimensions, dataCallback, endCallback) => {
//   const doc = new PDFDocument({ size: 'letter', layout: 'landscape' })
//   const fontsFolderPath = path.join(__dirname, '../../fonts/Raleway/static');
//   //const fontsFolderSuperHosting = path.join(__dirname, '../fonts/Raleway/static');
//   const ralewayStandardFont = path.join(fontsFolderPath, 'Raleway-Light.ttf');
//   //layout
//   const columnWidth = doc.page.width / 4; // Divide the page width into two equal columns
//   const columnHeight = doc.page.height;
//   const gutter = 100; // Adjust the spacing between the columns
//   const startX = doc.page.margins.left;
//   const startY = doc.page.margins.top;
//   //layout
//   doc.registerFont('CustomFont', ralewayStandardFont);
//   doc.font('CustomFont');
//   try {
//     doc.image(imageSrc,
//       10, 30, { width: columnWidth, height: columnHeight/3, fit: [30, 30] }
//       )
//     doc.fontSize(12).text('СЕРТИФИКАТ ЗА', 
//     50, 30, { width: columnWidth})
//     doc.fontSize(12).text('АВТЕНТИЧНОСТ', 
//     50, 50, { width: columnWidth})
//     doc.fontSize(10).text(`АВТОР: ${artist}`, 
//       50, 80, { width: columnWidth})
//     doc.fontSize(10).text(`ТВОРБА: ${title}`,
//       50, 100, { width: columnWidth})
//     doc.fontSize(10).text(`ТЕХНИКА: ${technique}`,
//       50, 120, { width: columnWidth})
//     doc.fontSize(10).text(`РАЗМЕР: ${dimensions}см`,
//       50, 140, { width: columnWidth})
//     doc.image(imageSrc,
//       50, 160, { width: columnWidth, height: columnHeight, fit: [200, Infinity] }
//       )
//     doc.fontSize(6).text('Заключение: Произведението е оригинал', 
//       50, 400, { width: columnWidth})
//     doc.fontSize(6).text('Малка Художествена Галерия', 
//       50, 420, { width: columnWidth})
//     doc.fontSize(8).text(bio, 
//       startX + columnWidth + gutter, 30, { width: 320 })
//     doc.on('data', dataCallback)
//     doc.on('end', endCallback)
//     doc.end()
//   } catch {
//    throw new Error("Could not create certificate!");
//   }
//  };
