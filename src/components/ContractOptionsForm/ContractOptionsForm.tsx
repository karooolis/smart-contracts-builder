import _ from "lodash";
import { z, ZodObject, ZodString, ZodNumber, ZodEnum } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ERC20_SCHEMA, ERC721_SCHEMA, formSchemaDefaultValues } from "./constants";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ExplanationTooltip } from "@/components/ExplanationTooltip";
import { Separator } from "../ui/separator";

const TextField = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const constructForm = (form, schema: ZodObject<any>) => {
  const elements = Object.keys(schema.shape).map((key) => {
    const field = schema.shape[key];
    const title = _.startCase(key);
    const type = field.constructor.name;
    const helpText = field?.description;
    console.log("type", key, type);

    if (field instanceof ZodString) {
      return (
        <FormField
          key={key}
          control={form.control}
          name={key}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {title}
                {helpText && (
                  <ExplanationTooltip>{helpText}</ExplanationTooltip>
                )}
              </FormLabel>
              <FormControl>
                <Input placeholder={title} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    } else if (field instanceof ZodNumber) {
      return (
        <FormField
          key={key}
          control={form.control}
          name={key}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {title}
                {helpText && (
                  <ExplanationTooltip>{helpText}</ExplanationTooltip>
                )}
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder={title} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    } else if (field instanceof ZodEnum) {
      return (
        <>
          <FormField
            key={key}
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">{title}</FormLabel>
                  {helpText && (
                    <FormDescription>
                      Select the additional features to add.
                    </FormDescription>
                  )}
                </div>

                {field.options.map((fieldId) => {
                  const item = {
                    id: fieldId,
                    label: fieldId,
                    info: "INFO",
                  };

                  return (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="features"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  item.id
                                )
                                // || (item.id == "permit" && library == "solmate")
                                }
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                                // disabled={
                                // item.id == "permit" && library == "solmate"
                                // }
                              />
                            </FormControl>
                            <FormLabel className="flex w-full font-normal justify-between">
                              {_.startCase(item.label)}{" "}
                              {item.info && (
                                <ExplanationTooltip>
                                  {item.info}
                                </ExplanationTooltip>
                              )}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
        </>
      );
    } else if (field instanceof ZodObject) {
      return (
        <>
          {constructForm(form, field)}
          <Separator />
        </>
      );
    }
  });

  return elements;
};

export const ContractOptionsForm = () => {
  const form = useForm<z.infer<typeof ERC20_SCHEMA>>({
    resolver: zodResolver(ERC20_SCHEMA),
    defaultValues: formSchemaDefaultValues,
  });

  function onChange() {
    // const values = form.getValues();
    // const template = getTemplate(values);
    // setCode(template);
  }

  return (
    <Form {...form}>
      <form onChange={onChange} className="space-y-6">
        {constructForm(form, ERC20_SCHEMA)}
      </form>
    </Form>
  );
};

export default ContractOptionsForm;
