
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Download, Save, Upload } from "lucide-react";

const backupSchema = z.object({
  location: z.string().min(1, "Backup location is required"),
  frequency: z.string().min(1, "Backup frequency is required"),
  autoBackup: z.boolean().optional(),
});

export default function Settings() {
  const backupForm = useForm<z.infer<typeof backupSchema>>({
    resolver: zodResolver(backupSchema),
    defaultValues: {
      location: "",
      frequency: "daily",
      autoBackup: true,
    },
  });

  function onBackupSubmit(values: z.infer<typeof backupSchema>) {
    console.log(values);
    toast.success("Backup settings saved", {
      description: "Your backup configuration has been updated.",
    });
  }

  function handleBackupNow() {
    toast.success("Backup initiated", {
      description: "Your data is being backed up. This may take a few moments.",
    });
    
    // Simulate backup completion
    setTimeout(() => {
      toast.success("Backup completed", {
        description: "Your data has been successfully backed up.",
      });
    }, 3000);
  }

  function handleRestore() {
    toast.success("Restore initiated", {
      description: "Your data is being restored. This may take a few moments.",
    });
    
    // Simulate restore completion
    setTimeout(() => {
      toast.success("Restore completed", {
        description: "Your data has been successfully restored.",
      });
    }, 3000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="backup">
        <TabsList>
          <TabsTrigger value="backup">Data Backup</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backup" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Backup and Restore</CardTitle>
              <CardDescription>
                Configure automatic backup settings or perform manual backup and restore.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...backupForm}>
                <form onSubmit={backupForm.handleSubmit(onBackupSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={backupForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Location</FormLabel>
                          <FormControl>
                            <Input placeholder="C:\Backups" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={backupForm.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={backupForm.control}
                    name="autoBackup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Enable automatic backups
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={handleBackupNow}>
                        <Download className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                      <Button type="button" variant="outline" onClick={handleRestore}>
                        <Upload className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export your financial data in various formats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-8 w-8 mb-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-8 w-8 mb-2" />
                  Export as Excel
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-8 w-8 mb-2" />
                  Export as CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Account settings will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
