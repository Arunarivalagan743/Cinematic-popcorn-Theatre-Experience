import ParkingSlot, { ParkingStatus } from '../models/parking.model.js';
import Showtime from '../models/showtime.model.js';

// Get parking slots for a specific showtime
export const getParkingSlotsByShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    
    // Check if the showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    // Check if the showtime is bookable based on cutoff time
    const currentTime = new Date();
    const showtimeStart = new Date(showtime.startTime);
    const cutoffTime = new Date(showtimeStart.getTime() - (showtime.cutoffMinutes * 60000));
    
    if (currentTime > showtimeStart) {
      return res.status(400).json({ 
        message: 'Booking not available. Showtime has already started',
        isBookable: false
      });
    }
    
    if (currentTime > cutoffTime) {
      return res.status(400).json({ 
        message: `Booking not available. Cutoff time (${showtime.cutoffMinutes} minutes before showtime) has passed`,
        isBookable: false
      });
    }
    
    // Get all parking slots for this showtime
    const twoWheelerSlots = await ParkingSlot.find({ 
      showtimeId,
      type: 'twoWheeler'
    }).sort({ slotNumber: 1 });
    
    const fourWheelerSlots = await ParkingSlot.find({
      showtimeId,
      type: 'fourWheeler'
    }).sort({ slotNumber: 1 });
    
    res.status(200).json({
      twoWheelerSlots,
      fourWheelerSlots,
      isBookable: true,
      showtime
    });
  } catch (error) {
    console.error('Error fetching parking slots:', error);
    res.status(500).json({ message: 'Failed to fetch parking slots', error: error.message });
  }
};

// Hold parking slots temporarily for a user
export const holdParkingSlots = async (req, res) => {
  try {
    const { showtimeId, slotIds, userId, vehicleNumbers } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({ message: 'Slot IDs array is required' });
    }
    
    if (!vehicleNumbers || !Array.isArray(vehicleNumbers) || vehicleNumbers.length !== slotIds.length) {
      return res.status(400).json({ message: 'Vehicle numbers array must match slot IDs array' });
    }
    
    // Check if the showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    // Check if the showtime is bookable based on cutoff time
    const currentTime = new Date();
    const showtimeStart = new Date(showtime.startTime);
    const cutoffTime = new Date(showtimeStart.getTime() - (showtime.cutoffMinutes * 60000));
    
    if (currentTime > showtimeStart) {
      return res.status(400).json({ message: 'Booking not available. Showtime has already started' });
    }
    
    if (currentTime > cutoffTime) {
      return res.status(400).json({ 
        message: `Booking not available. Cutoff time (${showtime.cutoffMinutes} minutes before showtime) has passed`
      });
    }
    
    // Set expiration time (5 minutes from now)
    const holdUntil = new Date(Date.now() + 15 * 60000); // 15 minutes
    
    // Update all slots to HELD status if they are available
    for (let i = 0; i < slotIds.length; i++) {
      const slotId = slotIds[i];
      const vehicleNumber = vehicleNumbers[i];
      
      const slot = await ParkingSlot.findById(slotId);
      if (!slot || slot.status !== ParkingStatus.AVAILABLE) {
        // If any slot is not available, release all slots we've already held
        await ParkingSlot.updateMany(
          {
            _id: { $in: slotIds.slice(0, i) },
            status: ParkingStatus.HELD,
            userId
          },
          {
            $set: {
              status: ParkingStatus.AVAILABLE,
              holdUntil: null,
              userId: null,
              vehicleNumber: null
            }
          }
        );
        
        return res.status(409).json({
          message: `Parking slot ${slot?.slotNumber || slotId} is no longer available`,
          success: false
        });
      }
      
      // Update the slot
      slot.status = ParkingStatus.HELD;
      slot.holdUntil = holdUntil;
      slot.userId = userId;
      slot.vehicleNumber = vehicleNumber;
      await slot.save();
    }
    
    // Get the updated slots
    const updatedSlots = await ParkingSlot.find({ _id: { $in: slotIds } });
    
    // Emit socket event for real-time updates
    req.app.get('io').to(`showtime-${showtimeId}`).emit('parkingUpdated', {
      parkingSlots: updatedSlots,
      showtimeId
    });
    
    res.status(200).json({
      message: 'Parking slots held successfully',
      parkingSlots: updatedSlots,
      holdUntil
    });
  } catch (error) {
    console.error('Error holding parking slots:', error);
    res.status(500).json({ message: 'Failed to hold parking slots', error: error.message });
  }
};

// Release held parking slots
export const releaseHeldParkingSlots = async (req, res) => {
  try {
    const { slotIds, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({ message: 'Slot IDs array is required' });
    }
    
    // Get the showtime ID for socket emission
    const slot = await ParkingSlot.findById(slotIds[0]);
    const showtimeId = slot ? slot.showtimeId : null;
    
    // Release only the slots that are held by this user
    const result = await ParkingSlot.updateMany(
      {
        _id: { $in: slotIds },
        status: ParkingStatus.HELD,
        userId
      },
      {
        $set: {
          status: ParkingStatus.AVAILABLE,
          holdUntil: null,
          userId: null,
          vehicleNumber: null
        }
      }
    );
    
    // Get the updated slots
    const updatedSlots = await ParkingSlot.find({ _id: { $in: slotIds } });
    
    // Emit socket event for real-time updates
    if (showtimeId) {
      req.app.get('io').to(`showtime-${showtimeId}`).emit('parkingUpdated', {
        parkingSlots: updatedSlots,
        showtimeId
      });
    }
    
    res.status(200).json({
      message: 'Parking slots released successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error releasing parking slots:', error);
    res.status(500).json({ message: 'Failed to release parking slots', error: error.message });
  }
};

// Automatically release expired parking holds
export const releaseExpiredParkingHolds = async () => {
  try {
    const currentTime = new Date();
    
    // Find parking slots with expired holds
    const expiredSlots = await ParkingSlot.find({
      status: ParkingStatus.HELD,
      holdUntil: { $lt: currentTime }
    });
    
    // Group slots by showtime for socket notifications
    const slotsByShowtime = expiredSlots.reduce((acc, slot) => {
      const showtimeId = slot.showtimeId.toString();
      if (!acc[showtimeId]) {
        acc[showtimeId] = [];
      }
      acc[showtimeId].push(slot._id);
      return acc;
    }, {});
    
    // Release all expired holds
    const result = await ParkingSlot.updateMany(
      {
        status: ParkingStatus.HELD,
        holdUntil: { $lt: currentTime }
      },
      {
        $set: {
          status: ParkingStatus.AVAILABLE,
          holdUntil: null,
          userId: null,
          vehicleNumber: null
        }
      }
    );
    
    console.log(`Released ${result.modifiedCount} expired parking holds`);
    return {
      releasedCount: result.modifiedCount,
      slotsByShowtime
    };
  } catch (error) {
    console.error('Error releasing expired parking holds:', error);
    throw error;
  }
};
