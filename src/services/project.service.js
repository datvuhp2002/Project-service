"use strict";

const { getInfoData } = require("../utils");
const prisma = require("../prisma");
const RoleService = require("./client.service");
const ProjectPropertyService = require("./project.property.service");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const projectController = require("../controllers/project.controller");
class ProjectService {
  static select = {
    name: true,
    projectCode: true,
    description: true,
    startAt: true,
    endAt: true,
    turnover: true,
    document: true,
    investor: true,
    createdBy: true,
    modifiedBy: true,
    createdAt: true,
    ProjectProperty: {
      select: {
        project_property_id: true,
        project_id: true,
        department_id: true,
        client_id: true,
      },
    },
  };
  // create a new project
  static create = async (data, modifiedBy) => {
    const { department_id, client_id, ...projectData } = data;
    const projectPropertyData = { department_id, client_id };
    if (!client_id) {
      delete projectPropertyData.client_id;
    }
    const newProject = await prisma.project.create({
      data: { ...projectData, modifiedBy },
    });
    if (newProject) {
      await ProjectPropertyService.create({
        project_id: newProject.project_id,
        ...projectPropertyData,
      });
    }
    return {
      code: 201,
    };
    return {
      code: 200,
      data: null,
    };
  };
  // get all projects
  static getAll = async ({
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    return await this.queryProject({
      condition: false,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  // get all projects has been deleted
  static trash = async ({
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    return await this.queryProject({
      condition: true,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };

  // detail project
  static detail = async (id) => {
    return await prisma.project.findUnique({
      where: { user_id: id },
      select: this.select,
    });
  };
  // update project
  static update = async ({ id, data }, modifiedBy) => {
    const { department_id, client_id, ...projectData } = data;
    if (department_id || client_id) {
      await ProjectPropertyService.update({ department_id, client_id }, id);
    }
    return await prisma.project.update({
      where: { project_id: id },
      data: { ...projectData, modifiedBy },
      select: this.select,
    });
  };
  // delete project
  static delete = async (project_id) => {
    const deleteProject = await prisma.project.update({
      where: { project_id },
      select: this.select,
      data: {
        deletedMark: true,
        deletedAt: new Date(),
      },
    });
    if (deleteProject) {
      await ProjectPropertyService.delete(project_id);
      return deleteProject;
    }
    return null;
  };
  // restore project
  static restore = async (project_id) => {
    const restoreProject = await prisma.project.update({
      where: { project_id },
      select: this.select,
      data: {
        deletedMark: false,
      },
    });
    if (restoreProject) {
      await projectController.restore(project_id);
      return restoreProject;
    }
    return null;
  };
  static queryProject = async ({
    query,
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    const itemsPerPage = Number(items_per_page) || 10;
    const currentPage = Number(page) || 1;
    const searchKeyword = search || "";
    const skip = currentPage > 1 ? (currentPage - 1) * itemsPerPage : 0;
    let whereClause = {
      OR: [
        {
          name: {
            contains: searchKeyword,
          },
        },
        {
          projectCode: {
            contains: searchKeyword,
          },
        },
      ],
    };

    if (query && query.length > 0) {
      whereClause.AND = query;
    }
    const projects = await prisma.project.findMany({
      take: itemsPerPage,
      skip,
      select: this.select,
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.project.count({
      where: whereClause,
    });
    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPageNumber = currentPage + 1 > lastPage ? null : currentPage + 1;
    const previousPageNumber = currentPage - 1 < 1 ? null : currentPage - 1;
    return {
      data: projects,
      total,
      nextPage: nextPageNumber,
      previousPage: previousPageNumber,
      currentPage,
      itemsPerPage,
    };
  };
}
module.exports = ProjectService;
