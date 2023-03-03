const {sequelize} = require('./db');
const {Band, Musician, Song} = require('./index')

describe('Band and Musician Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeEach(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
    })

    test('can create a Band', async () => {
        // TODO - test creating a band
        const testBand = await Band.create({name: "WHO", genre: "Pop", showCount: 1})
        expect(testBand.name).toBe("WHO");
        expect(testBand.showCount).toBe(1);
    })

    test('can delete instance', async () => {
        const testBand = await Band.create({name: "WHO", genre: "Pop", showCount: 1})
        const testMusician = await Musician.create({name: "Johnny", instrument: "flute"})
        expect(testBand.name).toBe("WHO");
        expect(testMusician.name).toBe("Johnny");

        await testBand.destroy();
        await testMusician.destroy();
        const band = await Band.findByPk(testBand.id);
        const music = await Musician.findByPk(testMusician.id);
  
        expect(band).toBeNull();
        expect(music).toBeNull();
    })

    test('can create a Musician', async () => {
        // TODO - test creating a musician
        const testMusician = await Musician.create({name: "Johnny", instrument: "flute"})
        expect(testMusician.name).toBe("Johnny");
    })

    test('can update', async () => {
        const testBand = await Band.create({name: "WHO", genre: "Pop", showCount: 1})
        const testMusician = await Musician.create({name: "Johnny", instrument: "flute"})
        expect(testBand.name).toBe("WHO");
        expect(testMusician.name).toBe("Johnny");

        const updatedBand = await testBand.update({name: "NOW"})
        const updatedMusician = await testMusician.update({name: "John"})
        expect(testBand.name).toBe("NOW");
        expect(testMusician.name).toBe("John");
    })


    test('can create a Band and Add association', async () => {
        // TODO - test creating a band
        const testBand = await Band.create({name: "WHO", genre: "Pop", showCount: 1})
        const testMusician1 = await Musician.create({name: "Johnny1", instrument: "flute"})
        const testMusician2 = await Musician.create({name: "Johnny2", instrument: "flute"})

        const band = await Band.findByPk(1)
        await band.addMusician(testMusician1)
        await band.addMusician(testMusician2)

        const bandMusicians = await band.getMusicians()
        expect(bandMusicians.length).toBe(2)
    })

    test('can add multiple musicians to a band', async () => {
        const testBand1 = await Band.create({name: "WHO1", genre: "Pop", showCount: 1})
        const testBand2 = await Band.create({name: "WHO2", genre: "Pop", showCount: 1})

        const testSong1 = await Song.create({title: "ABC", year: 2000})
        const testSong2 = await Song.create({title: "DEF", year: 3000})

        // Test to see if Song is actually creating instances.
        expect(testSong1.title).toBe("ABC")
        expect(testSong2.title).toBe("DEF")

        // Tests to see if bands and songs are associated

        await testBand1.addSongs(testSong1)
        let bandSongsArr = await testBand1.getSongs()
        expect(bandSongsArr.length).toBe(1)

        
        await testBand1.addSongs(testSong2)
        bandSongsArr = await testBand1.getSongs()
        expect(bandSongsArr.length).toBe(2)
        

        // ===============
        
        // test to see if band2 is associated with any of the songs. It shouldnt.
        await testSong1.addBands(testBand1)
        let songsBandArr = await testSong1.getBands()
        expect(songsBandArr.some(band => band.name === "WHO2")).toBe(false)


    })


    test("Create test data and associate the models and find all bands using eager loading", async () => {
        // Bands
        const testBand1 = await Band.create({name: "WHO1", genre: "Pop", showCount: 1})
        const testBand2 = await Band.create({name: "WHO2", genre: "Pop", showCount: 1})

        // Musicians
        const testMusician1 = await Musician.create({name: "Johnny1", instrument: "flute"})
        const testMusician2 = await Musician.create({name: "Johnny2", instrument: "flute"})

        // Songs
        const testSong1 = await Song.create({title: "ABC", year: 2000})
        const testSong2 = await Song.create({title: "DEF", year: 3000})

        await testBand1.addMusician(testMusician1)
        await testBand1.addMusician(testMusician2)

        const someBand = await Band.findAll({
            include: [
                {model: Musician}
            ]
        })

        expect(someBand[0].Musicians.length).toBe(2)

        await testBand1.addSongs(testSong1)
        await testBand1.addSongs(testSong2)

        const someSongs = await Band.findAll({
            include: [
                {model: Song}
            ]
        })

        expect(someSongs[0].Songs.length).toBe(2)
    })
})