

'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "./image-upload";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash2, Bus, Camera, MapPin, ShoppingBag, UtensilsCrossed, X as XIcon, GripVertical, Edit, Check } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tour, CreateTourInputSchema } from "@/backend/tours/domain/tour.model";
import { Badge } from "@/components/ui/badge";


export function getFieldTab(fieldName: string): string {
    if (fieldName.startsWith('details')) {
        return 'details';
    }
    if (fieldName.startsWith('itinerary') || fieldName.startsWith('pickupPoint')) {
        return 'itinerary';
    }
    if (fieldName.startsWith('title.de') || fieldName.startsWith('content.fr')) {
        return 'translations';
    }
    if (fieldName.startsWith('price') || fieldName.startsWith('availabilityPeriods')) {
        return 'availability';
    }
    return 'main';
}


type TourFormValues = z.infer<typeof CreateTourInputSchema>;
type AvailabilityPeriod = TourFormValues['availabilityPeriods'][number];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekDayInitials = ["L", "M", "X", "J", "V", "S", "D"];
const availableLanguages = ["en", "de", "fr", "nl"];

function AvailabilityPeriodForm({ 
    onSave,
    onCancel,
    initialData
}: { 
    onSave: (period: AvailabilityPeriod) => void;
    onCancel: () => void;
    initialData?: AvailabilityPeriod;
}) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialData ? { from: new Date(initialData.startDate), to: new Date(initialData.endDate) } : { from: new Date(), to: addDays(new Date(), 20) }
    );
    const [activeDays, setActiveDays] = useState<string[]>(initialData?.activeDays || []);
    const [languages, setLanguages] = useState<string[]>(initialData?.languages || []);
    const [error, setError] = useState<string | null>(null);

    const handleSavePeriod = () => {
        setError(null);
        if (!dateRange?.from || !dateRange?.to) {
            setError("Debes seleccionar un rango de fechas.");
            return;
        }
        if (activeDays.length === 0) {
            setError("Debes seleccionar al menos un día activo.");
            return;
        }
        if (languages.length === 0) {
            setError("Debes seleccionar al menos un idioma.");
            return;
        }
        onSave({ startDate: dateRange.from, endDate: dateRange.to, activeDays, languages });
    };
    
    const handleToggleAllWeek = () => {
        if (activeDays.length === weekDays.length) {
            setActiveDays([]);
        } else {
            setActiveDays(weekDays);
        }
    };
    
    const handleToggleAllLanguages = () => {
        if (languages.length === availableLanguages.length) {
            setLanguages([]);
        } else {
            setLanguages(availableLanguages);
        }
    }

    return (
        <Card className="mt-4 bg-secondary/50 border-dashed">
            <CardContent className="p-4 space-y-4">
                <div>
                    <FormLabel>Date Range</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal mt-1", !dateRange && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Select a range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <FormLabel>Active Days</FormLabel>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <ToggleGroup type="multiple" value={activeDays} onValueChange={setActiveDays} variant="outline" className="flex-wrap justify-start">
                            {weekDays.map((day, index) => (
                                <ToggleGroupItem
                                    key={day}
                                    value={day}
                                    aria-label={`Toggle ${day}`}
                                    className="w-10 h-10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                    {weekDayInitials[index]}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                        <Button type="button" variant="link" size="sm" onClick={handleToggleAllWeek} className="px-2">
                           All week
                        </Button>
                    </div>
                </div>
                 <div>
                    <FormLabel>Available Languages</FormLabel>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <ToggleGroup type="multiple" value={languages} onValueChange={setLanguages} variant="outline" className="flex-wrap justify-start">
                            {availableLanguages.map((lang) => (
                                <ToggleGroupItem
                                    key={lang}
                                    value={lang}
                                    aria-label={`Toggle ${lang}`}
                                    className="w-10 h-10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground uppercase"
                                >
                                    {lang}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                         <Button type="button" variant="link" size="sm" onClick={handleToggleAllLanguages} className="px-2">
                           All languages
                        </Button>
                    </div>
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="button" onClick={handleSavePeriod}>Save Period</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ActivityTagsInput({ field, fieldName }: { field: any, fieldName: string }) {
    const [inputValue, setInputValue] = useState('');
    const { setValue, getValues } = useFormContext();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const currentActivities = getValues(fieldName) || [];
            setValue(fieldName, [...currentActivities, inputValue.trim()]);
            setInputValue('');
        }
    };

    const removeActivity = (indexToRemove: number) => {
        const currentActivities = getValues(fieldName) || [];
        setValue(fieldName, currentActivities.filter((_: any, index: number) => index !== indexToRemove));
    };

    return (
        <div>
            <Input
                placeholder="Add an activity and press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((activity: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {activity}
                        <button type="button" onClick={() => removeActivity(index)} className="rounded-full hover:bg-muted-foreground/20">
                            <XIcon className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}

const iconMap = {
    Bus: <Bus className="h-5 w-5" />,
    Camera: <Camera className="h-5 w-5" />,
    MapPin: <MapPin className="h-5 w-5" />,
    ShoppingBag: <ShoppingBag className="h-5 w-5" />,
    UtensilsCrossed: <UtensilsCrossed className="h-5 w-5" />,
};

interface TourFormProps {
  initialData?: Tour;
  onServerImageDelete?: (imageUrl: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  errorTab: string | null;
}

export function TourForm({ initialData, onServerImageDelete, activeTab, onTabChange, errorTab }: TourFormProps) {
  const [editingItineraryId, setEditingItineraryId] = useState<string | null>(null);
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [editingPeriodIndex, setEditingPeriodIndex] = useState<number | null>(null);
  const form = useFormContext<TourFormValues>();

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "availabilityPeriods",
  });
  
  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  const allowDeposit = form.watch("allowDeposit");

  const langTabs = [
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'nl', name: 'Nederlands' },
  ];

  const watchedItinerary = form.watch('itinerary');

  return (
    <div className="pt-2">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full md:grid md:w-full md:grid-cols-5 flex justify-start overflow-x-auto">
          <TabsTrigger value="main" className={cn(errorTab === 'main' && 'border-destructive border animate-pulse')}>Content & Images</TabsTrigger>
          <TabsTrigger value="availability" className={cn(errorTab === 'availability' && 'border-destructive border animate-pulse')}>Availability & Pricing</TabsTrigger>
          <TabsTrigger value="details" className={cn(errorTab === 'details' && 'border-destructive border animate-pulse')}>Details</TabsTrigger>
          <TabsTrigger value="itinerary" className={cn(errorTab === 'itinerary' && 'border-destructive border animate-pulse')}>Itinerary</TabsTrigger>
          <TabsTrigger value="translations" className={cn(errorTab === 'translations' && 'border-destructive border animate-pulse')}>Translations</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="mt-6">
          <Card>
          <CardHeader>
              <CardTitle>Main Content (English)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              <FormField
              control={form.control}
              name="title.en"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Tramuntana Views & Island Heart" {...field} /></FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="slug.en"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Slug (URL-friendly)</FormLabel>
                  <FormControl><Input placeholder="e-g-tramuntana-views-island-heart" {...field} /></FormControl>
                  <FormDescription>This will be part of the URL. Use lowercase letters, numbers, and hyphens only.</FormDescription>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="description.en"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Short Description (for cards)</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="overview.en"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>General Overview (detail page)</FormLabel>
                  <FormControl><Textarea rows={6} {...field} /></FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
          </CardContent>
          </Card>

          <Card className="mt-6">
              <CardHeader>
                  <CardTitle>General Information (English)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <FormField
                      control={form.control}
                      name="generalInfo.cancellationPolicy.en"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Cancellation Policy</FormLabel>
                              <FormControl><Textarea rows={2} placeholder="e.g., Cancel up to 24 hours in advance for a full refund" {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="generalInfo.bookingPolicy.en"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Booking Policy</FormLabel>
                              <FormControl><Textarea rows={2} placeholder="e.g., Flexible plans: book your spot immediately, without being charged today." {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="generalInfo.guideInfo.en"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Guide Information</FormLabel>
                              <FormControl><Textarea rows={1} placeholder="e.g., English, German, French, Dutch" {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="generalInfo.pickupInfo.en"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Pickup Information</FormLabel>
                              <FormControl><Textarea rows={4} placeholder="Describe the details of the pickup service..." {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </CardContent>
          </Card>

          <Card className="mt-6">
              <CardHeader>
                  <CardTitle>Tour Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                  <FormField
                      control={form.control}
                      name="mainImage"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Main Image</FormLabel>
                              <FormDescription>This is the image that will be displayed on the tour cards.</FormDescription>
                              <FormControl>
                                  <ImageUpload
                                      value={field.value ? [field.value] : []}
                                      onChange={(file) => field.onChange(file)}
                                      onRemove={() => field.onChange(undefined)}
                                      multiple={false}
                                      onServerImageDelete={onServerImageDelete}
                                  />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                      />
                  <FormField
                      control={form.control}
                      name="galleryImages"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Image Gallery</FormLabel>
                              <FormDescription>These images will be displayed on the tour detail page.</FormDescription>
                              <FormControl>
                                  <ImageUpload
                                      value={field.value || []}
                                      onChange={(files) => field.onChange(files)}
                                      onRemove={(fileToRemove) => {
                                          const newValue = [...(field.value || [])].filter(file => file !== fileToRemove);
                                          field.onChange(newValue);
                                      }}
                                      multiple={true}
                                      onServerImageDelete={onServerImageDelete}
                                  />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                      />
              </CardContent>
          </Card>
      </TabsContent>

      <TabsContent value="availability" className="mt-6">
          <Card>
          <CardHeader><CardTitle>Availability & Pricing</CardTitle></CardHeader>
          <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Base Price (€)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="childPrice"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Child Price (€)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 60" {...field} /></FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="durationHours"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Tour Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a region" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  <SelectItem value="North">North</SelectItem>
                                  <SelectItem value="East">East</SelectItem>
                                  <SelectItem value="South">South</SelectItem>
                                  <SelectItem value="West">West</SelectItem>
                                  <SelectItem value="Central">Central</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
              </div>
              <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured Tour</FormLabel>
                          <FormDescription>Check if this tour should appear on the homepage.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                  )}
                  />
              <FormField
                  control={form.control}
                  name="allowDeposit"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow booking with deposit</FormLabel>
                          <FormDescription>Allow customers to pay a deposit to book, and the rest on site.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                  )}
                  />
              {allowDeposit && (
                  <FormField
                      control={form.control}
                      name="depositPrice"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Deposit Price (€)</FormLabel>
                              <FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl>
                              <FormDescription>The customer will pay this amount to book. The rest is paid on site.</FormDescription>
                              <FormMessage />
                          </FormItem>
                      )}
                      />
              )}
                <div>
                    <h3 className="text-lg font-medium mb-2">Availability Periods</h3>
                    <FormMessage>{form.formState.errors.availabilityPeriods?.root?.message}</FormMessage>
                    <div className="space-y-3">
                        {fields.map((field, index) =>
                            editingPeriodIndex === index ? (
                                <AvailabilityPeriodForm
                                    key={field.id}
                                    initialData={field}
                                    onSave={(updatedPeriod) => {
                                        update(index, updatedPeriod);
                                        setEditingPeriodIndex(null);
                                    }}
                                    onCancel={() => setEditingPeriodIndex(null)}
                                />
                            ) : (
                                <Card key={field.id} className="bg-secondary/30">
                                    <CardContent className="p-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{format(new Date(field.startDate), "dd/MM/yy")} - {format(new Date(field.endDate), "dd/MM/yy")}</p>
                                            <div className="flex gap-1.5 mt-2">
                                                {weekDays.map((day, i) => (
                                                    <span key={day} className={cn("text-xs font-mono w-6 h-6 flex items-center justify-center rounded-full", field.activeDays.includes(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                                        {weekDayInitials[i]}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-1.5 mt-2">
                                                {(field.languages || []).map(lang => (
                                                    <Badge key={lang} variant="outline" className="uppercase text-xs">{lang}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => setEditingPeriodIndex(index)}>
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>
                     {isAddingPeriod ? (
                        <AvailabilityPeriodForm
                            onSave={(period) => {
                                append(period);
                                setIsAddingPeriod(false);
                            }}
                            onCancel={() => setIsAddingPeriod(false)}
                        />
                    ) : (
                        <Button type="button" variant="outline" onClick={() => setIsAddingPeriod(true)} className="mt-4 w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Availability Period
                        </Button>
                    )}
                    <FormMessage>{form.formState.errors.availabilityPeriods?.message}</FormMessage>
                </div>
          </CardContent>
          </Card>
      </TabsContent>

      <TabsContent value="details" className="mt-6">
          <Card>
              <CardHeader>
                  <CardTitle>Tour Details (English)</CardTitle>
                  <CardDescription>
                      This content populates the accordion on the tour detail page. For lists, write one item per line.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                   <FormField
                      control={form.control}
                      name="details.highlights.en"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Highlights</FormLabel>
                              <FormControl><Textarea rows={4} placeholder="e.g., Enjoy a traditional Mallorcan lunch..." {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="details.fullDescription.en"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Full Description ("In Detail" section)</FormLabel>
                              <FormControl><Textarea rows={6} placeholder="Escape the tourist crowds and discover the authentic side of Mallorca..." {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                          control={form.control}
                          name="details.included.en"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>What's Included</FormLabel>
                                  <FormControl><Textarea rows={4} placeholder="e.g., Scenic drive along the coastal cliffs" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="details.notIncluded.en"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>What's Not Included</FormLabel>
                                  <FormControl><Textarea rows={4} placeholder="e.g., Personal expenses" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                   <Card className="bg-secondary/30">
                      <CardHeader><CardTitle className="text-xl">Important Information</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                           <FormField
                              control={form.control}
                              name="details.notSuitableFor.en"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Not suitable for</FormLabel>
                                      <FormControl><Textarea rows={2} placeholder="e.g., People with mobility impairments" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="details.whatToBring.en"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>What to bring</FormLabel>
                                      <FormControl><Textarea rows={3} placeholder="e.g., Comfortable shoes" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="details.beforeYouGo.en"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Before you go</FormLabel>
                                      <FormControl><Textarea rows={3} placeholder="e.g., Wear comfortable shoes for walking." {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </CardContent>
                   </Card>
              </CardContent>
          </Card>
      </TabsContent>

      <TabsContent value="itinerary" className="mt-6">
          <Card>
              <CardHeader><CardTitle>Itinerary Builder</CardTitle></CardHeader>
              <CardContent>
                   <div className="relative">
                      <div className="absolute left-6 top-0 h-full w-1 bg-border -translate-x-1/2"></div>
                      
                      <div className="relative flex items-start gap-6 pb-8">
                          <div className="z-10 flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                                  <div className="w-4 h-4 rounded-full bg-accent ring-4 ring-accent/20"></div>
                              </div>
                          </div>
                          <div className="flex-1 pt-2.5">
                              <Card className="shadow-md border border-accent/50">
                                  <CardHeader className="flex-row items-center gap-3 p-4">
                                      <MapPin className="h-6 w-6 text-accent flex-shrink-0" />
                                      <CardTitle className="text-xl">Pickup Point</CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-4 pt-0 space-y-4">
                                      <FormField
                                          control={form.control}
                                          name="pickupPoint.title.en"
                                          render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Main Title</FormLabel>
                                                  <FormControl><Input placeholder="e.g., 41 pickup location options" {...field} /></FormControl>
                                                  <FormMessage />
                                              </FormItem>
                                          )}
                                      />
                                      <FormField
                                          control={form.control}
                                          name="pickupPoint.description.en"
                                          render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Description / List of Points</FormLabel>
                                                  <FormControl><Textarea rows={4} placeholder="Detailed list of all pickup points..." {...field} /></FormControl>
                                                  <FormMessage />
                                              </FormItem>
                                          )}
                                      />
                                  </CardContent>
                              </Card>
                          </div>
                      </div>


                      <div className="space-y-8">
                      {itineraryFields.map((field, index) => {
                           const isEditing = editingItineraryId === field.id;

                          return (
                              <div key={field.id} className="relative flex items-start gap-6">
                                  <div className="z-10 flex flex-col items-center">
                                      <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                                          <div className={cn(
                                              "w-4 h-4 rounded-full",
                                              field.type === 'stop' ? "bg-accent ring-4 ring-accent/20" : "bg-muted-foreground"
                                          )}></div>
                                      </div>
                                  </div>
                                  <div className="flex-1">
                                      {isEditing ? (
                                           <Card className="bg-secondary/30 border-primary shadow-lg -mt-1">
                                              <CardContent className="p-4 space-y-4">
                                                   <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                      <FormField
                                                          control={form.control}
                                                          name={`itinerary.${index}.title.en`}
                                                          render={({ field }) => (
                                                              <FormItem className="md:col-span-2">
                                                                  <FormLabel>Title (Stop or Leg)</FormLabel>
                                                                  <FormControl><Input placeholder="e.g., Journey to Valldemossa" {...field} /></FormControl>
                                                                  <FormMessage />
                                                              </FormItem>
                                                          )}
                                                      />
                                                      <FormField
                                                          control={form.control}
                                                          name={`itinerary.${index}.duration`}
                                                          render={({ field }) => (
                                                              <FormItem>
                                                                  <FormLabel>Duration</FormLabel>
                                                                  <FormControl><Input placeholder="e.g., 45 minutes" {...field} /></FormControl>
                                                                  <FormMessage />
                                                              </FormItem>
                                                          )}
                                                      />
                                                      <FormField
                                                          control={form.control}
                                                          name={`itinerary.${index}.icon`}
                                                          render={({ field: selectField }) => (
                                                          <FormItem>
                                                              <FormLabel>Icon</FormLabel>
                                                              <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
                                                                  <FormControl>
                                                                      <SelectTrigger>
                                                                          <SelectValue placeholder="Select an icon" />
                                                                      </SelectTrigger>
                                                                  </FormControl>
                                                                  <SelectContent>
                                                                      {Object.keys(iconMap).map(iconKey => (
                                                                          <SelectItem key={iconKey} value={iconKey}>
                                                                              <div className="flex items-center gap-2">
                                                                                  {React.cloneElement(iconMap[iconKey as keyof typeof iconMap], { className: "h-4 w-4"})}
                                                                                  {iconKey}
                                                                              </div>
                                                                          </SelectItem>
                                                                      ))}
                                                                  </SelectContent>
                                                              </Select>
                                                              <FormMessage />
                                                          </FormItem>
                                                          )}
                                                      />
                                                      {form.watch(`itinerary.${index}.type`) === 'stop' && (
                                                          <div className="md:col-span-3">
                                                              <FormField
                                                                  control={form.control}
                                                                  name={`itinerary.${index}.activities.en`}
                                                                  render={({ field: activityField }) => (
                                                                      <FormItem>
                                                                          <FormLabel>Activities (Tags)</FormLabel>
                                                                          <FormControl>
                                                                              <ActivityTagsInput field={activityField} fieldName={`itinerary.${index}.activities.en`} />
                                                                          </FormControl>
                                                                          <FormMessage />
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                          </div>
                                                      )}
                                                  </div>
                                                  <div className="flex justify-end gap-2">
                                                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditingItineraryId(null)}>Cancel</Button>
                                                      <Button type="button" size="sm" onClick={() => setEditingItineraryId(null)}><Check className="mr-2 h-4 w-4"/>Save</Button>
                                                  </div>
                                              </CardContent>
                                           </Card>
                                      ) : (
                                          field.type === 'stop' ? (
                                              <Card className="shadow-md border border-border/80 -mt-1 group">
                                                  <CardContent className="p-4 relative">
                                                      <div className="flex items-center gap-3">
                                                          {iconMap[field.icon as keyof typeof iconMap]}
                                                          <div>
                                                              <p className="font-semibold text-primary text-sm">{field.duration}</p>
                                                              <h3 className="text-lg font-bold">{field.title.en || 'Untitled'}</h3>
                                                          </div>
                                                      </div>
                                                      {field.activities?.en && field.activities.en.length > 0 && (
                                                          <div className="mt-4 flex flex-wrap gap-2 pl-9">
                                                              {field.activities.en.map((activity, i) => (
                                                                  <Badge key={i} variant="secondary">{activity}</Badge>
                                                              ))}
                                                          </div>
                                                      )}
                                                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingItineraryId(field.id)}><Edit className="h-4 w-4" /></Button>
                                                          <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeItinerary(index)}><Trash2 className="h-4 w-4" /></Button>
                                                      </div>
                                                  </CardContent>
                                              </Card>
                                          ) : (
                                              <div className="pt-3 flex items-center gap-3 group">
                                                  {iconMap[field.icon as keyof typeof iconMap] || <Bus className="h-6 w-6 text-muted-foreground" />}
                                                  <p className="font-semibold text-muted-foreground">
                                                      {field.title.en || 'Travel leg'} ({field.duration})
                                                  </p>
                                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingItineraryId(field.id)}><Edit className="h-4 w-4" /></Button>
                                                      <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeItinerary(index)}><Trash2 className="h-4 w-4" /></Button>
                                                  </div>
                                              </div>
                                          )
                                      )}
                                  </div>
                              </div>
                          )
                      })}
                      </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                      <Button type="button" variant="outline" className="w-full" onClick={() => {
                          const newId = crypto.randomUUID();
                          appendItinerary({ id: newId, type: 'stop', icon: 'MapPin', duration: '', title: { en: '' }, activities: { en: [] } });
                          setEditingItineraryId(newId);
                      }}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Stop
                      </Button>
                      <Button type="button" variant="secondary" className="w-full" onClick={() => {
                          const newId = crypto.randomUUID();
                          appendItinerary({ id: newId, type: 'travel', icon: 'Bus', duration: '', title: { en: '' }, activities: {en: []} });
                          setEditingItineraryId(newId);
                      }}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Travel Leg
                      </Button>
                  </div>
              </CardContent>
          </Card>
      </TabsContent>

      <TabsContent value="translations" className="mt-6">
          <Card>
              <CardHeader>
                  <CardTitle>Translations</CardTitle>
                  <CardDescription>Review and edit the AI-generated translations for each language.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Tabs defaultValue="de" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                          {langTabs.map(lang => <TabsTrigger key={lang.code} value={lang.code}>{lang.name}</TabsTrigger>)}
                      </TabsList>
                      {langTabs.map(lang => (
                          <TabsContent key={lang.code} value={lang.code} className="mt-4 space-y-6">
                              
                              <Card className="bg-secondary/50">
                                  <CardHeader><CardTitle className="text-lg">Main & General Content</CardTitle></CardHeader>
                                  <CardContent className="space-y-4">
                                      <FormField control={form.control} name={`title.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Title ({lang.code.toUpperCase()})</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`slug.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Slug ({lang.code.toUpperCase()})</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`description.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Short Description ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={2} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`overview.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>General Overview ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={5} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`generalInfo.cancellationPolicy.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Cancellation Policy ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={2} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`generalInfo.bookingPolicy.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Booking Policy ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={2} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`generalInfo.guideInfo.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Guide Information ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={1} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`generalInfo.pickupInfo.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Pickup Information ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                  </CardContent>
                              </Card>

                              <Card className="bg-secondary/50">
                                  <CardHeader><CardTitle className="text-lg">Tour Details Content</CardTitle></CardHeader>
                                  <CardContent className="space-y-4">
                                      <FormField control={form.control} name={`details.highlights.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Highlights ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`details.fullDescription.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Full Description ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={6} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`details.included.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Included ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`details.notIncluded.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Not Included ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`details.notSuitableFor.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Not Suitable For ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={2} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`details.whatToBring.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>What To Bring ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={3} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`details.beforeYouGo.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Before You Go ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={3} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                  </CardContent>
                              </Card>
                              
                              <Card className="bg-secondary/50">
                                  <CardHeader><CardTitle className="text-lg">Pickup & Itinerary Content</CardTitle></CardHeader>
                                  <CardContent className="space-y-4">
                                      <FormField control={form.control} name={`pickupPoint.title.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Pickup Point Title ({lang.code.toUpperCase()})</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormField control={form.control} name={`pickupPoint.description.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Pickup Point Description ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={3} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      
                                      {Array.isArray(watchedItinerary) && watchedItinerary.map((_, index) => (
                                          <div key={index} className="p-4 border rounded-md bg-background/50">
                                              <p className="text-sm font-medium text-muted-foreground mb-2">Itinerary - Item {index + 1}</p>
                                              <FormField control={form.control} name={`itinerary.${index}.title.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem> <FormLabel>Title ({lang.code.toUpperCase()})</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                              {form.watch(`itinerary.${index}.type`) === 'stop' && (
                                                  <FormField control={form.control} name={`itinerary.${index}.activities.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => ( <FormItem className="mt-4"> <FormLabel>Activities ({lang.code.toUpperCase()})</FormLabel> <FormControl><ActivityTagsInput field={field} fieldName={`itinerary.${index}.activities.${lang.code as 'de' | 'fr' | 'nl'}`} /></FormControl> <FormMessage /> </FormItem> )}/>
                                              )}
                                          </div>
                                      ))}
                                  </CardContent>
                              </Card>

                          </TabsContent>
                      ))}
                  </Tabs>
              </CardContent>
          </Card>
      </TabsContent>
      </Tabs>
    </div>
  );
}
