import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { User } from "../models/user.model.js";

export const createFolder = async (req, res) => {
  const owner = req.user._id;
  const { name, parentFolder } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  const folder = await Folder.create({
    name: name,
    owner: owner,
    parentFolder: parentFolder,
  });

  return res.status(201).json(folder);
};

export const getFolders = async (req, res) => {
  const folders = await Folder.find({ owner: req.user?._id });
  return res.status(200).json(folders);
};

export const getFolderById = async (req, res) => {
  const { folderId } = req.params;
  const folder = await Folder.findById(folderId);
  if (!folder) {
    return res.status(404).json({ error: "Cannot find folder" });
  }
  return res.status(200).json(folder);
};

export const viewFolderContent = async (req, res) => {
  const { folderId } = req.params;
  const folder = await Folder.findOne({ _id: folderId, owner: req.user._id });
  if (!folder) {
    return res.status(404).json({ error: "Folder not found" });
  }
  const subFolder = await Folder.find({
    parentFolder: folderId,
    owner: req.user._id,
  });

  const file = await File.find({
    folder: folderId,
    owner: req.user._id,
  });

  return res.status(200).json({ folder, subFolder, file });
};

export const updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  const folder = await Folder.findOneAndUpdate(
    { _id: folderId, owner: req.user._id },
    {
      name: name,
    },
  );
  if (!folder) {
    return res.status(404).json({ error: "Folder does not exist" });
  }
  return res.status(200).json(folder);
};

export const deleteFolder = async (req, res) => {
  const { folderId } = req.params;

  const folder = await Folder.findOneAndDelete({ _id: folderId, owner: req.user._id },);

  if (!folder) {
    return res.status(404).json({ error: "Folder does not exist" });
  }

  return res.status(200).json({ message: "Folder deleted successfully" });
};
