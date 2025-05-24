
const inventoryService = require('../services/inventory.service');

class InventoryController {
    async getInventoryBySkus (req, res) {
        try {
            const skus = req.query.skus?.split(',').map(s => s.trim());
            console.log('Received SKUs:', skus);
            if (!Array.isArray(skus) || skus.length === 0) {
                return res.status(400).json({ error: 'Invalid or missing SKUs' });
            }

            const result = await inventoryService.getInventoryBySkus(skus);
            console.log('Result:', result);
            if (!result || result.length === 0) {
                return res.status(404).json({ error: 'No inventory found for the provided SKUs' });
            }

            res.status(200).json(result);

        } catch (error) {
            console.error('Error fetching inventory:', error);
            res.status(500).json({ error: 'Failed to fetch inventory', details: error.message });
        }
    }
}

module.exports = new InventoryController();