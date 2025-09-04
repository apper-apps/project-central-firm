class ProjectService {
  constructor() {
    this.tableName = 'project_c';
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
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "deliverables_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "chatEnabled_c" } },
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
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id || id === null || id === undefined || id === '') {
        throw new Error("Valid project ID is required");
      }
      
      const numericId = parseInt(id);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error("Valid project ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "deliverables_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "chatEnabled_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, numericId, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(projectData) {
    try {
      const params = {
        records: [
          {
            Name: projectData.Name || projectData.name,
            description_c: projectData.description_c || projectData.description,
            status_c: projectData.status_c || projectData.status || "Planning",
            deadline_c: projectData.deadline_c || projectData.deadline,
            deliverables_c: projectData.deliverables_c || projectData.deliverables,
            startDate_c: projectData.startDate_c || projectData.startDate,
            chatEnabled_c: projectData.chatEnabled_c !== undefined ? projectData.chatEnabled_c : projectData.chatEnabled !== undefined ? projectData.chatEnabled : true,
            createdAt_c: new Date().toISOString(),
            Tags: projectData.Tags || []
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
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, projectData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: projectData.Name || projectData.name,
            description_c: projectData.description_c || projectData.description,
            status_c: projectData.status_c || projectData.status,
            deadline_c: projectData.deadline_c || projectData.deadline,
            deliverables_c: projectData.deliverables_c || projectData.deliverables,
            startDate_c: projectData.startDate_c || projectData.startDate,
            chatEnabled_c: projectData.chatEnabled_c !== undefined ? projectData.chatEnabled_c : projectData.chatEnabled,
            Tags: projectData.Tags || []
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
          console.error(`Failed to update project ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating project:", error?.response?.data?.message);
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
          console.error(`Failed to delete project ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  // Milestone operations - using separate milestone table
  async getMilestonesByProjectId(projectId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "isCompleted_c" } },
          { field: { Name: "completedDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "projectId_c" } }
        ],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "dueDate_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('milestone_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching milestones:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async createMilestone(projectId, milestoneData) {
    try {
      const params = {
        records: [
          {
            Name: milestoneData.Name || milestoneData.title || milestoneData.name,
            title_c: milestoneData.title_c || milestoneData.title,
            description_c: milestoneData.description_c || milestoneData.description || "",
            dueDate_c: milestoneData.dueDate_c || milestoneData.dueDate,
            isCompleted_c: milestoneData.isCompleted_c || false,
            completedDate_c: null,
            createdAt_c: new Date().toISOString(),
            projectId_c: parseInt(projectId)
          }
        ]
      };

      const response = await this.apperClient.createRecord('milestone_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create milestone ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating milestone:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async updateMilestone(milestoneId, milestoneData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(milestoneId),
            Name: milestoneData.Name || milestoneData.title || milestoneData.name,
            title_c: milestoneData.title_c || milestoneData.title,
            description_c: milestoneData.description_c || milestoneData.description,
            dueDate_c: milestoneData.dueDate_c || milestoneData.dueDate,
            isCompleted_c: milestoneData.isCompleted_c !== undefined ? milestoneData.isCompleted_c : milestoneData.isCompleted,
            completedDate_c: milestoneData.isCompleted_c || milestoneData.isCompleted ? new Date().toISOString() : null
          }
        ]
      };

      const response = await this.apperClient.updateRecord('milestone_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update milestone ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating milestone:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async deleteMilestone(milestoneId) {
    try {
      const params = {
        RecordIds: [parseInt(milestoneId)]
      };

      const response = await this.apperClient.deleteRecord('milestone_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete milestone ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting milestone:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}
export default new ProjectService();