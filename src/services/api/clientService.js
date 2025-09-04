class ClientService {
  constructor() {
    this.tableName = 'client_c';
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching clients:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Client ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching client with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(clientData) {
    try {
      const params = {
        records: [
          {
            Name: clientData.Name || clientData.name,
            company_c: clientData.company_c || clientData.company,
            email_c: clientData.email_c || clientData.email,
            phone_c: clientData.phone_c || clientData.phone,
            website_c: clientData.website_c || clientData.website,
            address_c: clientData.address_c || clientData.address,
            industry_c: clientData.industry_c || clientData.industry,
            status_c: clientData.status_c || clientData.status || "Active",
            createdAt_c: new Date().toISOString(),
            Tags: clientData.Tags || []
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create client ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating client:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, clientData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: clientData.Name || clientData.name,
            company_c: clientData.company_c || clientData.company,
            email_c: clientData.email_c || clientData.email,
            phone_c: clientData.phone_c || clientData.phone,
            website_c: clientData.website_c || clientData.website,
            address_c: clientData.address_c || clientData.address,
            industry_c: clientData.industry_c || clientData.industry,
            status_c: clientData.status_c || clientData.status,
            Tags: clientData.Tags || []
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update client ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating client:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete client ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting client:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  async getProjectsByClientId(clientId) {
    try {
      // Import projectService to get projects for this client
      const projectService = (await import("./projectService.js")).default;
      const allProjects = await projectService.getAll();
      return allProjects.filter(project => {
        // Handle both lookup object format and direct ID format
        const projectClientId = project.clientId_c?.Id || project.clientId_c || project.clientId;
        return projectClientId === parseInt(clientId);
      });
    } catch (error) {
      console.error("Error fetching projects for client:", error);
      return [];
    }
  }
}

export default new ClientService();