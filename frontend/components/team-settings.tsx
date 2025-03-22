"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Users, UserPlus, Mail, Check, Trash2, Shield, ShieldCheck, ShieldAlert, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TeamSettingsProps {
  onClose: () => void
}

// Mock team members data
const mockTeamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#4f46e5",
    status: "active",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "Editor",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#0ea5e9",
    status: "active",
  },
  {
    id: 3,
    name: "Sam Taylor",
    email: "sam@example.com",
    role: "Viewer",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#10b981",
    status: "pending",
  },
  {
    id: 4,
    name: "Jamie Lee",
    email: "jamie@example.com",
    role: "Editor",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#f59e0b",
    status: "active",
  },
]

// Mock team settings
const mockTeamSettings = {
  name: "AI Workflow Team",
  description: "Our team working on AI agent workflows",
  visibility: "private",
  allowExternalSharing: true,
  requireApproval: true,
  notifyOnChanges: true,
}

export function TeamSettings({ onClose }: TeamSettingsProps) {
  const [activeTab, setActiveTab] = useState("members")
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers)
  const [teamSettings, setTeamSettings] = useState(mockTeamSettings)
  const [searchQuery, setSearchQuery] = useState("")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Viewer")

  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle inviting a new team member
  const handleInviteMember = () => {
    if (!inviteEmail) return

    // In a real app, this would send an invitation
    const newMember = {
      id: teamMembers.length + 1,
      name: inviteEmail.split("@")[0], // Use part of email as name
      email: inviteEmail,
      role: inviteRole,
      avatar: "/placeholder.svg?height=40&width=40",
      color: "#6366f1",
      status: "pending",
    }

    setTeamMembers([...teamMembers, newMember])
    setInviteEmail("")
    setShowInviteDialog(false)
  }

  // Handle removing a team member
  const handleRemoveMember = (id: number) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  // Handle changing a team member's role
  const handleChangeRole = (id: number, newRole: string) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, role: newRole } : member)))
  }

  // Handle updating team settings
  const handleUpdateSettings = (key: string, value: any) => {
    setTeamSettings({
      ...teamSettings,
      [key]: value,
    })
  }

  // Get role icon based on role
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <ShieldAlert size={16} className="text-red-500" />
      case "Editor":
        return <ShieldCheck size={16} className="text-blue-500" />
      case "Viewer":
        return <Shield size={16} className="text-gray-500" />
      default:
        return <Shield size={16} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute right-0 top-0 z-40 flex h-full w-[500px] flex-col glass-card shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <Users size={14} className="text-primary-foreground" />
          </div>
          <h2 className="text-lg font-heading font-semibold">Team Settings</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--accent))" }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="rounded-full p-1 hover:bg-accent transition-colors duration-200"
        >
          <X size={18} />
        </motion.button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="px-4 pt-4 bg-transparent justify-start">
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Team Members
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Team Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                className="pl-8 bg-background/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus size={16} />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Send an invitation to collaborate on your AI workflows.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        placeholder="colleague@example.com"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Role
                    </label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteMember}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto">
            <div className="space-y-3">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg glass-card p-3"
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="ring-2 ring-background">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback style={{ backgroundColor: member.color }}>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {member.status === "pending" && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={member.role} onValueChange={(value) => handleChangeRole(member.id, value)}>
                        <SelectTrigger className="h-8 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">
                            <div className="flex items-center gap-2">
                              <ShieldAlert size={14} />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="Editor">
                            <div className="flex items-center gap-2">
                              <ShieldCheck size={14} />
                              Editor
                            </div>
                          </SelectItem>
                          <SelectItem value="Viewer">
                            <div className="flex items-center gap-2">
                              <Shield size={14} />
                              Viewer
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-secondary p-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-medium">No members found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery ? "Try a different search term" : "Invite team members to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4">
          <div className="custom-scrollbar space-y-6 overflow-y-auto">
            <div className="space-y-2">
              <label htmlFor="team-name" className="text-sm font-medium">
                Team Name
              </label>
              <Input
                id="team-name"
                value={teamSettings.name}
                onChange={(e) => handleUpdateSettings("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="team-description" className="text-sm font-medium">
                Team Description
              </label>
              <Input
                id="team-description"
                value={teamSettings.description}
                onChange={(e) => handleUpdateSettings("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="team-visibility" className="text-sm font-medium">
                Team Visibility
              </label>
              <Select
                value={teamSettings.visibility}
                onValueChange={(value) => handleUpdateSettings("visibility", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {teamSettings.visibility === "public"
                  ? "Anyone in your organization can find and join this team"
                  : teamSettings.visibility === "private"
                    ? "Only invited members can access this team"
                    : "Only specific groups can access this team"}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Permissions & Notifications</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Allow External Sharing</p>
                  <p className="text-xs text-muted-foreground">
                    Team members can share workflows with people outside the team
                  </p>
                </div>
                <Button
                  variant={teamSettings.allowExternalSharing ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateSettings("allowExternalSharing", !teamSettings.allowExternalSharing)}
                >
                  {teamSettings.allowExternalSharing ? <Check size={16} className="mr-2" /> : null}
                  {teamSettings.allowExternalSharing ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Require Approval for Changes</p>
                  <p className="text-xs text-muted-foreground">Changes to workflows require admin approval</p>
                </div>
                <Button
                  variant={teamSettings.requireApproval ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateSettings("requireApproval", !teamSettings.requireApproval)}
                >
                  {teamSettings.requireApproval ? <Check size={16} className="mr-2" /> : null}
                  {teamSettings.requireApproval ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Notify on Workflow Changes</p>
                  <p className="text-xs text-muted-foreground">Receive notifications when workflows are modified</p>
                </div>
                <Button
                  variant={teamSettings.notifyOnChanges ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateSettings("notifyOnChanges", !teamSettings.notifyOnChanges)}
                >
                  {teamSettings.notifyOnChanges ? <Check size={16} className="mr-2" /> : null}
                  {teamSettings.notifyOnChanges ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Save Team Settings</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

