import _ from "lodash";
import { z, ZodObject, ZodString, ZodNumber, ZodEnum, ZodArray } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import prettier from "prettier/standalone";
import solidityPlugin from "prettier-plugin-solidity/standalone";

import { cn } from "@/lib/utils";
import { getTemplate } from "@/utils/templates";
import {
  ERC20_SCHEMA,
  ERC721_SCHEMA,
  formSchemaDefaultValues,
} from "./constants";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExplanationTooltip } from "@/components/ExplanationTooltip";
import { Separator } from "../ui/separator";
import { useStore } from "@/utils/store";

const constructForm = (form, schema: ZodObject<any>) => {
  const elements = Object.keys(schema.shape).map((key) => {
    const field = schema.shape[key];
    const title = _.startCase(key);
    const type = field.constructor.name;
    const helpText = field?.description;

    if (field instanceof ZodString) {
      return (
        <FormField
          key={key}
          control={form.control}
          name={key}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full justify-between">
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
              <FormLabel className="flex w-full justify-between">
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
    } else if (field instanceof ZodArray) {
      const options = field._def.type;
      return (
        <>
          <FormField
            key={key}
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="flex justify-between items-center">
                    {title}
                  </FormLabel>
                  {helpText && (
                    <FormDescription>
                      Select the additional features to add.
                    </FormDescription>
                  )}
                </div>

                {options.map((fieldId) => {
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
    } else if (field instanceof ZodEnum) {
      return (
        <>
          <FormField
            control={form.control}
            name={key}
            render={({ field: fieldInner }) => (
              <FormItem className="space-y-4">
                <FormLabel className="flex justify-between items-center">
                  {title}{" "}
                  <Switch
                    className="scale-75"
                    checked={field.value != "none"}
                    onCheckedChange={() => {
                      if (field.value == "none") {
                        form.setValue(key, _.first(field.options));
                      } else {
                        form.setValue(key, "none");
                      }
                    }}
                  />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {field.options.map((itemId, idx) => {
                      const id = itemId;
                      const label = _.startCase(itemId);
                      const info = "INFO";
                      const item = {
                        id: itemId,
                        label: _.startCase(itemId),
                        info: "INFO",
                      };

                      return (
                        <FormItem
                          key={idx}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              onClick={() => {
                                // form.setValue("accessControl", id);
                              }}
                              value={id}
                              // disabled={accessControl == "none"}
                            />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "flex w-full justify-between font-normal"
                              // accessControl == "none" && "line-through"
                            )}
                          >
                            {label}{" "}
                            {info && (
                              <ExplanationTooltip>{info}</ExplanationTooltip>
                            )}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
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

const formatCode = async (code: string) => {
  const formattedCode = await prettier.format(code, {
    parser: "solidity-parse",
    plugins: [solidityPlugin],
  });

  return formattedCode;
};

export const ContractOptionsForm = () => {
  const code = useStore((state) => state.code);
  const setCode = useStore((state) => state.setCode);

  const form = useForm<z.infer<typeof ERC20_SCHEMA>>({
    resolver: zodResolver(ERC20_SCHEMA),
    defaultValues: formSchemaDefaultValues,
  });

  const onChange = async () => {
    const values = form.getValues();
    const template = getTemplate(values);
    const formattedCode = await formatCode(template);
    setCode(formattedCode);
  };

  return (
    <Form {...form}>
      <form onChange={onChange} className="space-y-6">
        {constructForm(form, ERC20_SCHEMA)}
      </form>
    </Form>
  );
};

export default ContractOptionsForm;
