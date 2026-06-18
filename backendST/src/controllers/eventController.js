import Event from '../models/eventModel.js';

const eventController = {};

eventController.createEvent = async (req, res) => {
  try {
    //#1- Valido los datos
    const { event_name, event_start, event_end, discount, description, active } = req.body;

    //#2- Conecto con DB para guardar
    const event = await Event.create({
      event_name, event_start, event_end, discount, description, active
    });

    if (event) {
      res.json({ message: "Action done" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

eventController.getEvents = async (req, res) => {
  try {
    //#1- Conecto con DB para buscar
    const events = await Event.find({});
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: events });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default eventController;
